# Guide specialization icons

Original artwork generated with the built-in image generation tool for the
guide index. These are illustrative specialization symbols, not official spell
icons. KB spell IDs, official artwork and Wowhead tooltips are unchanged.

- Asset: `public/assets/spec-icons-white-v1.png` (1586 x 992).
- Mapping: `src/data/guideSpecIcons.js`, 40 optical centers, 176px square views.
- Rendering: CSS luminance mask. Black source pixels become transparent;
  white glyphs render at 58% opacity, 86% on hover or keyboard focus.
- Layout: 32px fixed boxes in the index, 48px beside guide titles (36px on
  mobile). Shared rendering lives in `src/components/SpecializationIcon.js`.

## Final edit prompt

Repair this production icon atlas, keeping exactly the same 40 motifs and same
row-major ordering in an EXACT evenly spaced 8 columns x 5 rows grid. Critical
change: use a PERFECTLY SOLID PURE BLACK (#000000) background, opaque, not
transparency. Each icon is a clean WHITE (#ffffff) pictogram with a few strong
BLACK negative-space cuts. Remove ALL scattered noise, white speckles, grunge,
grain, checkerboard, hatching, sketch marks, thin scratches, stray pixels,
surrounding accents and decorative strokes outside the glyphs. The black space
between icons must be totally empty and uninterrupted. Make these look like
pristine minimal vector icons: compact, bold simple silhouettes, limited
intentional cutouts, balanced medium weight, clear at 24px. Less detail. No
hairline details. Keep generous empty space around each icon: maximum glyph
width/height 60% of its square grid cell, aligned to exact cell centers. Canvas
ratio 8:5, exactly 8x5 equal square cells, no outer margin or inter-cell gutters
beyond internal whitespace. No titles, no text, no visible grid, no borders, no
circles surrounding the glyphs. Fix these specific shapes: the bottom row
second icon must clearly be a rooted tree, not a flame; bottom row third is two
simple demon horns around a single flame; bottom row fourth is one double-ended
crescent warglaive, not an axe; bottom row eighth a simple dragon wing curling
around a leaf. Preserve all other icon identities, consistent size and
white/black palette. This sheet is used as a CSS luminance mask: pure black is
transparent in the app, white is the icon. Anything gray or textured outside
the silhouettes is unacceptable.
