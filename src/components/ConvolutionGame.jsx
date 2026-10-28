import { ImageUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 320;
const PRESETS = {
  Edges: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  Vertical: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
  Sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  Blur: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  Emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
  Identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
};

function convolve(source, kernel) {
  const { width, height, data } = source;
  const output = new ImageData(width, height);
  const sum = kernel.reduce((total, value) => total + value, 0);
  const scale = sum > 0 ? 1 / sum : 1;
  const offset = sum === 0 ? 128 : 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      for (let ky = -1; ky <= 1; ky++) {
        const sy = Math.min(height - 1, Math.max(0, y + ky));
        for (let kx = -1; kx <= 1; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const index = (sy * width + sx) * 4;
          const grey = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
          value += grey * kernel[(ky + 1) * 3 + kx + 1];
        }
      }
      const shade = Math.max(0, Math.min(255, value * scale + offset));
      output.data.set([shade, shade, shade, 255], (y * width + x) * 4);
    }
  }
  return output;
}

export default function ConvolutionGame() {
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const source = useRef(null);
  const [kernel, setKernel] = useState(PRESETS.Edges);
  const [preset, setPreset] = useState("Edges");

  const render = useCallback((values) => {
    if (!source.current) return;
    outputRef.current.getContext("2d").putImageData(convolve(source.current, values), 0, 0);
  }, []);

  const load = useCallback(
    (url) => {
      const image = new Image();
      image.onload = () => {
        const context = inputRef.current.getContext("2d", { willReadFrequently: true });
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, SIZE, SIZE);
        source.current = context.getImageData(0, 0, SIZE, SIZE);
        render(kernel);
      };
      image.src = url;
    },
    [kernel, render],
  );

  useEffect(() => {
    load("/images/vessel-panel-a-0.webp");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    render(kernel);
  }, [kernel, render]);

  const choose = (name) => {
    setPreset(name);
    setKernel(PRESETS[name]);
  };

  const edit = (index, value) => {
    setPreset("Custom");
    setKernel((values) => values.map((current, position) => (position === index ? value : current)));
  };

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    load(url);
  };

  return (
    <div className="conv-game">
      <div className="conv-board">
        <figure>
          <canvas ref={inputRef} width={SIZE} height={SIZE} aria-label="Input image" role="img" />
          <figcaption>Input</figcaption>
        </figure>
        <div className="conv-kernel" role="group" aria-label="3 by 3 kernel">
          {kernel.map((value, index) => (
            <input
              key={index}
              type="number"
              step="1"
              value={value}
              aria-label={`Kernel weight ${index + 1}`}
              onChange={(event) => edit(index, Number(event.target.value) || 0)}
            />
          ))}
        </div>
        <figure>
          <canvas ref={outputRef} width={SIZE} height={SIZE} aria-label="Image after the convolution" role="img" />
          <figcaption>Feature map</figcaption>
        </figure>
      </div>
      <div className="descent-controls">
        <div className="boundary-tabs" role="group" aria-label="Kernel presets">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              type="button"
              className={`boundary-tab ${preset === name ? "is-active" : ""}`}
              aria-pressed={preset === name}
              onClick={() => choose(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="pill-button conv-upload">
          <ImageUp size={16} aria-hidden="true" />
          Use your own photo
          <input type="file" accept="image/*" onChange={upload} className="visually-hidden" />
        </label>
        <p className="descent-message">
          Change any of the nine weights and the feature map updates. This sliding 3 × 3 window is what the first
          layer of every CNN learns.
        </p>
        <p className="game-note">
          The vessel model I trained, DeepLabV3+ on ResNet-101, starts with 64 such filters learned from data. Your
          photo never leaves the browser.
        </p>
      </div>
    </div>
  );
}
