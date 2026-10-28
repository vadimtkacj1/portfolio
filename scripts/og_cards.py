import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONTS = Path("C:/Windows/Fonts")
WIDTH, HEIGHT = 1200, 630
BACKGROUND = (167, 171, 172)
INK = (28, 29, 32)
BLUE = (69, 92, 233)


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def wrap(draw, text, face, width):
    lines, line = [], ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if draw.textlength(candidate, font=face) <= width:
            line = candidate
        else:
            lines.append(line)
            line = word
    return lines + [line]


def card(project, target):
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw.text((72, 64), f"CASE STUDY  /  {project['category'].upper()}", font=font("segoeui.ttf", 22), fill=INK)
    size = 92
    while True:
        title = font("segoeuil.ttf", size)
        lines = wrap(draw, project["title"], title, WIDTH - 144)
        if len(lines) <= 3 or size <= 60:
            break
        size -= 6
    y = 128
    for line in lines:
        draw.text((68, y), line, font=title, fill=INK)
        y += int(size * 1.08)
    draw.ellipse((72, 528, 88, 544), fill=BLUE)
    draw.text((104, 518), project["result"], font=font("segoeui.ttf", 28), fill=INK)
    signature = "Vadim Tkachenko · AI Engineer"
    face = font("segoeui.ttf", 22)
    draw.text((WIDTH - 72 - draw.textlength(signature, font=face), 524), signature, font=face, fill=INK)
    image.save(target, optimize=True)


projects = json.loads(
    subprocess.check_output(
        ["node", "--input-type=module", "-e", "import { PROJECTS } from './src/data/site.js'; console.log(JSON.stringify(PROJECTS))"]
    )
)
for project in projects:
    card(project, Path("public/og") / f"{project['slug']}.png")
    print(project["slug"], file=sys.stderr)
