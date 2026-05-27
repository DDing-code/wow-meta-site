#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');

const forbiddenTerms = [
  { term: '\uc6d0\uace0', replacement: '\uac00\uc774\ub4dc/\ubcf8\ubb38' },
  { term: '\ud504\ub85c\ud1a0\ud0c0\uc785', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: '\ub0b4\ubd80 \ubb38\uc11c', replacement: '\ucd9c\ucc98/\uac80\uc218 \ubb38\ub9e5' },
  { term: '\uc784\uc758 \ubc88\uc5ed', replacement: '\uacf5\uc2dd \ud55c\uad6d\uc5b4 \ud45c\uae30' },
  { term: '\uc601\ubb38 \ub77c\ubca8', replacement: '\uacf5\uc2dd \ud55c\uad6d\uc5b4 \ud45c\uae30' },
  { term: '\uc624\ud504\ub108', replacement: '\uc624\ud504\ub2dd' },
  { term: '\uc624\ud504\ub2dd \ub51c\uc0ac\uc774\ud074', replacement: '\uc624\ud504\ub2dd \uc804\ud22c \ud750\ub984' },
  { term: '\ub85c\ud14c\uc774\uc158', replacement: '\ub51c\uc0ac\uc774\ud074' },
  { term: '\ubc84\uc2a4\ud2b8', replacement: '\uadf9\ub51c' },
  { term: '\uc708\ub3c4\uc6b0', replacement: '\ucc3d' },
  { term: 'Midnight', replacement: '\ud55c\ubc24' },
  { term: 'Stage 1', replacement: '1\ub2e8\uacc4' },
  { term: 'Stage 2', replacement: '2\ub2e8\uacc4' },
  { term: 'Stage 3', replacement: '3\ub2e8\uacc4' },
  { term: 'Soul Harvester', replacement: '\uc601\ud63c \uc218\ud655\uc790' },
  { term: 'Hellcaller', replacement: '\uc9c0\uc625\uc18c\ud658\uc0ac' },
  { term: 'Diabolist', replacement: '\uc545\ub9c8\ud559\uc790' },
  { term: 'Spellslinger', replacement: '\uc8fc\ubb38\uc220\uc0ac' },
  { term: 'Sunfury', replacement: '\uc131\ub09c\ud0dc\uc591' },
  { term: 'Frostfire', replacement: '\uc11c\ub9ac\ubd88\uaf43' },
  { term: 'Lightsmith', replacement: '\ube5b\ub300\uc7a5\uc774' },
  { term: 'Voidweaver', replacement: '\uacf5\ud5c8\uc220\uc0ac' },
  { term: 'Oracle', replacement: '\uc608\uc5b8\uc790' },
  { term: 'Herald of the Sun', replacement: '\ud0dc\uc591\uc758 \uc0ac\uc790' },
  { term: 'Templar', replacement: '\uae30\uc0ac\ub2e8' },
  { term: 'Aldrachi Reaver', replacement: '\uc54c\ub4dc\ub77c\uce58 \ud30c\uad34\uc790' },
  { term: 'Fel-Scarred', replacement: '\uc9c0\uc625\uc0c1\ud754' },
  { term: 'Deathbringer', replacement: '\uc8fd\uc74c\uc758 \uc778\ub3c4\uc790' },
  { term: 'Sanlayn', replacement: '\uc0b0\ub808\uc778' },
  { term: 'Rider of the Apocalypse', replacement: '\uc885\ub9d0\uc758 \uae30\uc218' },
  { term: "Elune's Chosen", replacement: '\uc5d8\ub8ec\uc758 \uc120\ud0dd' },
  { term: 'Druid of the Claw', replacement: '\ubc1c\ud1b1\uc758 \ub4dc\ub8e8\uc774\ub4dc' },
  { term: 'Wildstalker', replacement: '\uc57c\uc0dd\ucd94\uc801\uc790' },
  { term: 'Keeper of the Grove', replacement: '\uc232\uc758 \uc218\ud638\uc790' },
  { term: 'Scalecommander', replacement: '\ube44\ub298\uc0ac\ub839\uad00' },
  { term: 'Flameshaper', replacement: '\ubd88\uaf43\ud615\uc131\uc790' },
  { term: 'Chronowarden', replacement: '\uc2dc\uac04\uc218\ud638\uc790' },
  { term: 'Pack Leader', replacement: '\ubb34\ub9ac\uc758 \uc9c0\ub3c4\uc790' },
  { term: 'Dark Ranger', replacement: '\uc5b4\ub461\uc21c\ucc30\uc790' },
  { term: 'Sentinel', replacement: '\uc218\ud638\ubcd1' },
  { term: 'Shado-Pan', replacement: '\uc74c\uc601\ud30c' },
  { term: 'Conduit of the Celestials', replacement: '\ucc9c\uc2e0\ud569\uc77c' },
  { term: 'Master of Harmony', replacement: '\uc870\ud654\uc758 \ud615' },
  { term: 'Mountain Thane', replacement: '\uc0b0\uc655' },
  { term: 'Colossus', replacement: '\uac70\uc2e0' },
  { term: 'Slayer', replacement: '\ud559\uc0b4\uc790' },
];

function findLine(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function main() {
  const source = fs.readFileSync(MANUSCRIPT_PATH, 'utf8');
  const errors = [];

  for (const item of forbiddenTerms) {
    let index = source.indexOf(item.term);
    while (index !== -1) {
      errors.push({
        line: findLine(source, index),
        term: item.term,
        replacement: item.replacement,
      });
      index = source.indexOf(item.term, index + item.term.length);
    }
  }

  if (errors.length) {
    console.error(`Guide copy validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    errors.slice(0, 40).forEach(error => {
      console.error(`  - ${path.relative(SITE_ROOT, MANUSCRIPT_PATH)}:${error.line}: "${error.term}" -> "${error.replacement}"`);
    });
    if (errors.length > 40) {
      console.error(`  ... and ${errors.length - 40} more`);
    }
    process.exit(1);
  }

  console.log('Guide copy validation passed');
}

main();
