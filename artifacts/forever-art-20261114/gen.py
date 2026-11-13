# -*- coding: utf-8 -*-
"""포에버 페이지 도트 그림을 codex 그림 생성으로 만든다(공식 아트·스크린샷을 참고 그림으로 붙여 도트로 다시 그림).
  python gen.py                 # 없는 것만
  python gen.py --force 이름…   # 고른 것만 다시
결과: raw/<이름>.png (원본). 사이트용 변환은 build.py."""
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
WORK = os.path.join(HERE, "work")
REF = os.path.join(HERE, "ref")

STYLE = (
    "Art style: high-quality 16-bit pixel art in the look of a late SNES / GBA era fantasy RPG illustration. Crisp hard-edged "
    "square pixels on one consistent visible pixel grid (the whole picture should read as roughly 384 pixels wide), a limited "
    "palette of about 48 colors, hand-placed dithering for shading, dark one-pixel outlines on characters and objects, strong "
    "readable silhouettes. No anti-aliased blur, no smooth gradients, no photo or 3D-render look. Absolutely no text, letters, "
    "numbers, logos, watermark, signature, UI chrome, frame or border."
)
WIDE = "Landscape 3:2 picture (1536x1024). "
SQUARE = "Square 1:1 picture (1024x1024). "
RECREATE = (
    "The attached image is official World of Warcraft artwork / an official screenshot. Re-create it as pixel art: keep the same "
    "scene, composition, subjects, color scheme, lighting and mood, redrawn pixel by pixel in the style below. "
)
BANNER = (
    "The picture will be cropped to a very wide banner, so keep every important subject inside the middle horizontal band "
    "(between 25% and 80% of the height) and fill the top and bottom with scenery only. "
)

# 이름: (참고 그림 목록, 지시문)
JOBS = {
    # ── 포에버 홈 ──
    "hero-home": (["launch/01.png"], WIDE + RECREATE + BANNER +
        "Five adventurers resting around a crackling campfire at night in a pine forest: a huge tauren hunter with a bow on the "
        "left, an orc warrior with an axe, an elf mage in red robes reading a spellbook, a masked red-haired rogue in purple "
        "leather, and a tall night elf druid with a carved staff on the right. Behind them a colossal world tree silhouette "
        "against a deep blue starry sky. Warm orange firelight on the figures, cool blue everywhere else. "),
    "diff-rules": (["launch/09.png"], WIDE + RECREATE +
        "A dark stone hall with four tall hanging dark-parchment panels in a row, each with an ornate golden frame and one round "
        "emblem near its top: a campfire-and-sword adventure emblem, crossed swords, a white theatre mask, and a mask crossed "
        "with a sword. Replace all writing on the panels with blank parchment. Warm torch light from the right. No people, no hooded figures, no statues, no glowing eyes anywhere — only the hall, the four panels and a brazier. "),
    "diff-zones": (["launch/02.png"], WIDE + RECREATE +
        "A mossy ancient forest with giant dark pines, an eerie green sun glow through the mist, and a small timber village with "
        "pointed roofs and lit windows nestled among the trees, wildflowers in the foreground grass. "),
    "diff-classes": ([], WIDE +
        "A World of Warcraft scene: in a sunlit oak forest clearing a huge tauren hunter in fur and leather armor kneels to set a "
        "toothed steel bear trap on the ground in the middle of a fight, bow slung in his other hand, while his grey wolf pet "
        "lunges at a charging tusked boar. Dynamic side view, dust and leaves flying. Background is only forest, grassy hills and distant mountains — no buildings, no towers, no temples. "),
    "diff-races": (["launch/05.png"], WIDE + RECREATE +
        "A tall slender blue-skinned, blue-haired elf-like adventurer in a green tunic and gold trim standing confidently in "
        "front of a timber-framed village house with a wooden cart at dusk, purple-pink sky. Replace the two faction crest icons "
        "at the bottom with nothing (leave them out). "),
    "diff-raids": (["more/raid-8.png"], WIDE + RECREATE +
        "The inside of a vast volcanic dragon lair: a circular cavern ringed by glowing lava cracks and jagged fang-like rock "
        "spikes, and a great black dragon crouching in the center of the cave floor, embers drifting in the air. "),
    "diff-legacy": (["launch/12.png"], WIDE + RECREATE +
        "A fantastical shoreline with tall pink and purple coral trees, turquoise shallow water and a pale moon. Floating in the "
        "center is a dark wood-and-gold framed game window: a title bar with a green progress bar and six blank list rows with "
        "small golden arrows. Keep the window simple pixel UI with no readable writing. "),
    "diff-camping": (["launch/11.png"], WIDE + RECREATE +
        "A cozy adventurers' camp in a golden evening forest: a large canvas tent on the left, an armored adventurer standing by "
        "it, a small campfire ringed by stones in the middle with another adventurer sitting beside it, a wooden fence and a "
        "dirt road leading to a village in the distance. "),
    "diff-controls": (["launch/13.png"], WIDE +
        "Use the attached official screenshot only as the color and landscape reference (red savanna desert with flat-topped "
        "mesas at sunset). Draw: in the foreground, on a wooden desk, a chunky game controller on the left and a mechanical "
        "keyboard with a mouse on the right; behind them a big screen showing that red savanna with a small orc adventurer "
        "standing on a road and a row of square action-button slots (empty, no symbols) along the bottom of the screen. "),
    # ── 시작하기 ──
    "hero-start": (["more/h-newplayer.png"], WIDE + RECREATE + BANNER +
        "A glowing golden sunrise over a calm green sea, sun rays fanning through haze, the dark silhouette of a wrecked ship "
        "hull in the shallows and distant rocky islands on the horizon, small waves sparkling. "),
    "step-account": ([], WIDE +
        "A World of Warcraft style still life on a wooden inn table by candlelight: a rolled parchment travel pass with a blue "
        "wax seal, a golden hourglass with glowing sand, a small brass key, a leather coin pouch with a few gold coins, and a "
        "blue-glowing rune stone (a hearthstone with a spiral). Warm cozy tavern background with a fireplace, simple shapes only. No faction emblems, no lion crests, no banners: the wax seal is a plain round blue seal with a simple star. "),
    "step-install": ([], WIDE +
        "A cozy dark room at night: a chunky retro desktop computer with a big monitor on a wooden desk. On the monitor a pixel "
        "scene of adventurers at a campfire under a giant tree at night, and under it a wide progress bar that is three quarters "
        "filled in bright green. A keyboard, a mouse, a steaming mug and a small potted plant on the desk, light from the "
        "monitor glowing on the wall. "),
    "step-preset": (["launch/07.png", "launch/08.png"], WIDE +
        "The two attached official screenshots show the same red-bearded dwarf with a rifle on his back standing in shallow icy "
        "water before a snowy pine forest: the first is the classic low-detail character model, the second the high-detail "
        "model. Draw ONE picture split down the middle by a thin vertical golden divider line: on the left half the dwarf drawn "
        "deliberately blocky and simple with few flat colors (old-school look), on the right half the same dwarf in the same "
        "pose drawn with finer detail, richer shading and more colors. Same snowy pine forest and icy water behind both. "),
    "step-rules": ([], WIDE +
        "A World of Warcraft scene: a traveler in a plain brown hooded cloak (no emblem on the cloak) seen from behind stands at a crossroads in rolling green hills at dawn, "
        "looking up at a tall wooden signpost with four arrow-shaped signs pointing in different directions. Each sign carries "
        "one small carved emblem instead of writing: a campfire, crossed swords, a theatre mask, and a mask crossed with a "
        "sword. Four dirt roads lead away to a peaceful village, a distant battlefield with smoke, a lantern-lit town, and a "
        "fortress. "),
    "step-faction": ([], WIDE +
        "A World of Warcraft character-creation scene: on the left a human paladin in shining blue and gold plate armor with a "
        "hammer, a dwarf and a night elf behind him, under a tall blue banner with a golden lion head; on the right an orc "
        "warrior in dark red spiked armor with an axe, a tauren and a troll behind him, under a tall red banner with a black "
        "jagged tribal horned emblem. The two groups face each other across a stone bridge, mountains and sunrise behind. "),
    "step-name": (["launch/10.png"], WIDE + RECREATE +
        "A red desert camp at sunset: a canvas tent on the left, a campfire in the middle, three orc and goblin adventurers "
        "gathered around it (one kneeling in a purple robe, one standing in green, one in a red coat), a spiked wooden fort tower "
        "in the background. Above the head of each adventurer floats a small blank golden nameplate made of two short stacked "
        "bars (no writing on them). "),
    "basic-quest": ([], SQUARE +
        "A World of Warcraft scene: a friendly human farmer NPC with a big glowing golden exclamation mark symbol floating above "
        "his head, and next to him a dwarf guard with a big glowing golden question mark symbol above his head, standing on a "
        "village road in front of a timber inn. The two symbols are the only marks allowed. Centered composition. "),
    "basic-trainer": ([], SQUARE +
        "A World of Warcraft scene: inside a stone mage tower, an old bearded wizard trainer in purple robes holds out a glowing "
        "open spellbook to a young adventurer in simple leather gear, arcane sparkles rising from the pages, shelves of books "
        "and candles around. Centered composition. "),
    "basic-death": ([], SQUARE +
        "A World of Warcraft scene: a misty graveyard at night with crooked gravestones, and the Spirit Healer — a tall serene "
        "winged angelic figure glowing pale blue-white, floating above the graves with wings spread. In front of her stands the "
        "translucent ghost of an adventurer, everything in cold blue-grey monochrome tones. Centered composition. "),
    "basic-professions": ([], SQUARE +
        "A World of Warcraft style workshop still life: a blacksmith anvil with a hammer and a glowing ingot, a miner's pickaxe "
        "leaning on an ore rock, a bundle of green herbs and a red potion flask, a fishing rod with a caught fish, and a small "
        "cooking pot over a fire. Arranged neatly on a wooden floor against a stone wall with a forge glow. "),
    "basic-dungeon": ([], SQUARE +
        "A World of Warcraft scene: a party of five adventurers seen from behind, about to enter a dungeon — a dark stone archway "
        "with a swirling blue-purple portal. In front a heavily armored tank with a big shield, behind him a healer in white "
        "robes with a glowing staff, and three damage dealers: a mage with fire in hand, a hunter with a bow, a rogue with "
        "daggers. Torches on both sides of the gate. "),
    "tips-flight": ([], WIDE +
        "A World of Warcraft scene: a wooden flight platform on a hilltop at golden hour with a flight master in leather gear "
        "holding the reins of a large gryphon (eagle head and wings, lion body) with a saddle; a second gryphon carrying a tiny "
        "rider flies away over rolling green hills, a river and a distant castle town. "),
    # ── 규칙·진영 ──
    "hero-rules": (["more/h-rules.png"], WIDE + RECREATE + BANNER +
        "A moonlit night elf city in a giant forest: purple-leaved ancient trees, a paved stone path leading to a great tree "
        "house with glowing windows, a white marble domed pavilion on the right, blue light rays through the canopy, a small "
        "lone figure walking on the path. Blue and violet palette. "),
    "rule-normal": (["more/h-compare.png"], WIDE + RECREATE +
        "A peaceful riverside at sunset: a shallow shimmering river winding between broad leafy trees and grassy banks, hazy "
        "pink-gold sky with the low sun reflected on the water, and one small adventurer wading across the river. "),
    "rule-pvp": (["launch/17.png"], WIDE + RECREATE +
        "A snowy mountain battlefield: a muddy grey road cutting through deep snow between frosted pines, rows of sharpened "
        "wooden spike barricades, and two small groups of fighters clashing — defenders in blue on one side and attackers in "
        "red on the other, with spell flashes. "),
    "rule-rp": ([], WIDE +
        "A World of Warcraft scene: the warm interior of a human tavern in the evening — adventurers of different races (a "
        "human, a dwarf with a mug, a night elf, a gnome) sitting around a round wooden table deep in conversation, a bard "
        "playing a lute by a big stone fireplace, the innkeeper behind the bar, hanging lanterns and a wooden staircase. "),
    "rule-rppvp": ([], WIDE +
        "A World of Warcraft scene: inside a large open war tent at dusk, officers in ornate armor lean over a wooden table with "
        "a parchment map and small figurines, one pointing dramatically; two guards with spears stand at the tent opening, and "
        "outside plain crimson and gold war banners (simple stripes, no crests) flutter over a camp with watch fires. Everyone in the tent belongs to the same army and wears matching crimson and gold colors: humans, dwarves and elves only, no orcs. No lion crests, no faction emblems anywhere. No writing on the map. "),
    "rule-hardcore": (["launch/15.png"], WIDE +
        "Use the attached official screenshot as the setting and color reference (a drowned dead forest of bare leaning trees in "
        "murky water under a hazy pink-red sun). Add: one lone adventurer seen from behind, holding a burning torch, wading "
        "into the swamp along a row of crooked gravestones and a skull on a pole. Ominous, lonely mood. "),
    "together": ([], WIDE +
        "A World of Warcraft scene split by a deep rocky ravine with a broken rope bridge in the middle: on the left cliff a "
        "party of three friends (a human knight, a dwarf, a night elf) under a blue banner with a golden lion head waving "
        "across; on the right cliff a party of three (an orc, a tauren, a troll) under a red banner with a black jagged tribal "
        "horned emblem. Sunset sky, wide symmetrical composition. "),
}


def gen_one(name, tries=2):
    refs, prompt = JOBS[name]
    work = os.path.join(WORK, name)
    os.makedirs(work, exist_ok=True)
    os.makedirs(RAW, exist_ok=True)
    out_png = os.path.join(work, name + ".png")
    ref_note = (f"{len(refs)} reference image(s) are attached to this message; pass them to the image generation tool as "
                f"reference/input images. ") if refs else ""
    msg = (f"Use your image generation tool to generate ONE image, then copy the generated PNG file into the current working "
           f"directory as {name}.png. {ref_note}Do not edit, crop or post-process the generated image. Do nothing else and "
           f"finish. Image prompt: {prompt}{STYLE}")
    for k in range(tries):
        if os.path.exists(out_png):
            os.remove(out_png)
        cmd = ["codex", "exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", work]
        for ref in refs:
            cmd += ["-i", os.path.join(REF, ref)]
        cmd += ["--", msg]
        with open(os.path.join(work, f"log-{k}.txt"), "w", encoding="utf-8") as fp:
            try:
                subprocess.run(cmd, stdin=subprocess.DEVNULL, stdout=fp, stderr=subprocess.STDOUT, timeout=900, shell=False)
            except subprocess.TimeoutExpired:
                pass
        if os.path.exists(out_png) and os.path.getsize(out_png) > 50000:
            dst = os.path.join(RAW, name + ".png")
            with open(out_png, "rb") as src, open(dst, "wb") as fp:
                fp.write(src.read())
            print("OK", name, flush=True)
            return True
        print("재시도", name, k + 1, flush=True)
    print("실패", name, flush=True)
    return False


def main():
    force = "--force" in sys.argv
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or list(JOBS)
    todo = [n for n in names if force or not os.path.exists(os.path.join(RAW, n + ".png"))]
    print("만들 것:", todo, flush=True)
    with ThreadPoolExecutor(5) as pool:
        list(pool.map(gen_one, todo))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
