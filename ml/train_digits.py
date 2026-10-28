import base64
import io
import json
import sys
from pathlib import Path

import numpy as np
import pyarrow.parquet as pq
import torch
import torch.nn.functional as F
from huggingface_hub import hf_hub_download
from PIL import Image
from torch import nn

SIZES = [784, 128, 64, 10]
EPOCHS = 12
BATCH = 256


def load_split(split):
    path = hf_hub_download("ylecun/mnist", f"mnist/{split}-00000-of-00001.parquet", repo_type="dataset")
    rows = pq.read_table(path).to_pylist()
    images = np.stack([np.array(Image.open(io.BytesIO(row["image"]["bytes"])), dtype=np.float32) / 255 for row in rows])
    labels = np.array([row["label"] for row in rows], dtype=np.int64)
    return torch.from_numpy(images).unsqueeze(1), torch.from_numpy(labels)


def augment(images):
    batch = images.shape[0]
    angle = (torch.rand(batch) - 0.5) * 0.5
    scale = 0.85 + torch.rand(batch) * 0.3
    shift = (torch.rand(batch, 2) - 0.5) * 0.25
    cos, sin = torch.cos(angle) / scale, torch.sin(angle) / scale
    theta = torch.stack([torch.stack([cos, -sin, shift[:, 0]], 1), torch.stack([sin, cos, shift[:, 1]], 1)], 1)
    grid = F.affine_grid(theta, images.shape, align_corners=False)
    warped = F.grid_sample(images, grid, align_corners=False)
    thickness = torch.rand(batch) < 0.3
    warped[thickness] = F.max_pool2d(warped[thickness], 3, 1, 1)
    return warped


def build():
    layers = []
    for index in range(len(SIZES) - 1):
        layers.append(nn.Linear(SIZES[index], SIZES[index + 1]))
        if index < len(SIZES) - 2:
            layers.append(nn.ReLU())
    return nn.Sequential(nn.Flatten(), *layers)


def evaluate(model, images, labels):
    model.eval()
    with torch.no_grad():
        predictions = torch.cat([model(images[i : i + 2000]).argmax(1) for i in range(0, len(images), 2000)])
    model.train()
    return (predictions == labels).float().mean().item()


def quantise(model):
    layers = []
    for module in model:
        if not isinstance(module, nn.Linear):
            continue
        weight = module.weight.detach().numpy().astype(np.float32)
        scale = float(np.abs(weight).max() / 127)
        quantised = np.clip(np.round(weight / scale), -127, 127).astype(np.int8)
        layers.append(
            {
                "rows": weight.shape[0],
                "cols": weight.shape[1],
                "scale": scale,
                "weights": base64.b64encode(quantised.tobytes()).decode(),
                "bias": base64.b64encode(module.bias.detach().numpy().astype(np.float32).tobytes()).decode(),
            }
        )
    return layers


def main(output):
    torch.manual_seed(0)
    train_images, train_labels = load_split("train")
    test_images, test_labels = load_split("test")
    model = build()
    optimiser = torch.optim.AdamW(model.parameters(), lr=2e-3, weight_decay=1e-4)
    schedule = torch.optim.lr_scheduler.OneCycleLR(optimiser, 4e-3, total_steps=EPOCHS * (len(train_images) // BATCH + 1))
    for epoch in range(EPOCHS):
        order = torch.randperm(len(train_images))
        for start in range(0, len(train_images), BATCH):
            index = order[start : start + BATCH]
            loss = F.cross_entropy(model(augment(train_images[index])), train_labels[index])
            optimiser.zero_grad()
            loss.backward()
            optimiser.step()
            schedule.step()
        print(f"epoch {epoch + 1}: test accuracy {evaluate(model, test_images, test_labels):.4f}", flush=True)

    accuracy = evaluate(model, test_images, test_labels)
    layers = quantise(model)
    reference = build()
    with torch.no_grad():
        for module, layer in zip([m for m in reference if isinstance(m, nn.Linear)], layers, strict=True):
            weights = np.frombuffer(base64.b64decode(layer["weights"]), dtype=np.int8).astype(np.float32) * layer["scale"]
            module.weight.copy_(torch.from_numpy(weights.reshape(layer["rows"], layer["cols"])))
            module.bias.copy_(torch.from_numpy(np.frombuffer(base64.b64decode(layer["bias"]), dtype=np.float32).copy()))
    quantised_accuracy = evaluate(reference, test_images, test_labels)
    print(f"final {accuracy:.4f}, int8 {quantised_accuracy:.4f}")
    Path(output).write_text(
        json.dumps({"sizes": SIZES, "testAccuracy": round(quantised_accuracy, 4), "layers": layers}), encoding="utf-8"
    )


if __name__ == "__main__":
    main(sys.argv[1])
