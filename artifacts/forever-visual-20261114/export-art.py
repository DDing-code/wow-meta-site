from pathlib import Path
from PIL import Image

root = Path(__file__).parent
dest = root.parents[1] / 'public/images/forever'
dest.mkdir(parents=True, exist_ok=True)
def save(image, name, widths):
    for width in widths:
        image.resize((width, round(image.height * width / image.width)), Image.Resampling.NEAREST).save(dest / f'{name}-{width}.webp', quality=90, method=6)

save(Image.open(root / 'raw/map.png').convert('RGB'), 'world-atlas', [768, 1536])
for file, columns, rows, names in [
    ('classes', 3, 3, ['class-warrior','class-paladin','class-hunter','class-rogue','class-priest','class-shaman','class-mage','class-warlock','class-druid']),
    ('camp', 5, 2, ['facility-first-aid','facility-fishing','facility-alchemy','facility-blacksmithing','facility-enchanting','facility-engineering','facility-herbalism','facility-leatherworking','facility-skinning','facility-tailoring']),
    ('raids', 3, 1, ['raid-barrow','raid-hyjal','raid-onyxia']),
]:
    image = Image.open(root / f'raw/{file}.png').convert('RGB')
    for index, name in enumerate(names):
        x, y = index % columns, index // columns
        cell = image.crop((round(x * image.width / columns),round(y * image.height / rows),round((x + 1) * image.width / columns),round((y + 1) * image.height / rows)))
        save(cell, name, [512,1024])
print('23 illustrations exported')
