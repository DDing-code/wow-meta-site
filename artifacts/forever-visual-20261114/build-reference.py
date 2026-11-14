import json, io, urllib.request
from pathlib import Path
from PIL import Image

root = Path(__file__).parent
data = json.loads((root / 'map-evidence.json').read_text(encoding='utf-8'))
canvas = Image.new('RGB', (1808, 1280), '#0c171b')
for tile in data['tiles']:
    image = Image.open(io.BytesIO(urllib.request.urlopen(tile['src']).read())).convert('RGBA')
    image = image.resize((round(tile['w'] * 2), round(tile['h'] * 2)), Image.Resampling.NEAREST)
    canvas.paste(image, (round(tile['x'] * 2), round(tile['y'] * 2)), image)
canvas.save(root / 'refs/world.png')
print('world reference saved')
