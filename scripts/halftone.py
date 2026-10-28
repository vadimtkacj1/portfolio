import sys
from PIL import Image, ImageDraw, ImageOps

GAMMA = 0.72
EXPONENT = 1.55
STEP = 9


def tones(path):
    cut = Image.open(path).convert("RGBA")
    alpha = cut.split()[3]
    gray = ImageOps.autocontrast(cut.convert("L"), cutoff=1).point(lambda v: int(255 * (v / 255) ** GAMMA))
    return cut.size, alpha, gray


def render(path, out, preview=None, background=(167, 171, 172)):
    (w, h), alpha, gray = tones(path)
    scale = 3
    layers = [(Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0)), (28, 29, 32, 255))]
    if preview:
        layers.append((Image.new("RGB", (w * scale, h * scale), background), (28, 29, 32)))
    for y in range(0, h, STEP):
        for x in range(0, w, STEP):
            if alpha.getpixel((min(x + STEP // 2, w - 1), min(y + STEP // 2, h - 1))) < 110:
                continue
            box = list(gray.crop((x, y, x + STEP, y + STEP)).getdata())
            lum = sum(box) / (len(box) * 255)
            edge = max(0, min(1, (x + STEP / 2) / (w * 0.16), (w - x - STEP / 2) / (w * 0.16)))
            r = (1 - lum) ** EXPONENT * edge * STEP * 0.68 * scale
            if r < 0.35 * scale:
                continue
            cx, cy = (x + STEP / 2) * scale, (y + STEP / 2) * scale
            for image, color in layers:
                ImageDraw.Draw(image).ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    layers[0][0].resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=90, method=6)
    if preview:
        layers[1][0].resize((w // 2, h // 2), Image.LANCZOS).save(preview)


if __name__ == "__main__":
    render(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
