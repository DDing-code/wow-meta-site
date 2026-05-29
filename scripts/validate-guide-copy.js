#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const GUIDE_REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');

const forbiddenTerms = [
  { term: '\uc6d0\uace0', replacement: '\uac00\uc774\ub4dc/\ubcf8\ubb38' },
  { term: '\ub17c\ubb38', replacement: '\uacf5\ub7b5 \uae00' },
  { term: '\ud504\ub85c\ud1a0\ud0c0\uc785', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: '\ub0b4\ubd80 \ubb38\uc11c', replacement: '\ucd9c\ucc98/\uac80\uc218 \ubb38\ub9e5' },
  { term: '\ubb38\uc11c', replacement: '\uac00\uc774\ub4dc/\uc790\ub8cc' },
  { term: '\ud574\uc11d\uac12', replacement: '\uae30\ubcf8 \uc120\ud0dd\uc9c0/\uae30\uc900' },
  { term: '\uc9c1\uc811 \uc778\uc6a9', replacement: '\uacf5\uac1c\ub85c \ud655\uc778\ub418\ub294 \ub0b4\uc6a9\ub9cc \ubc18\uc601' },
  { term: '\uacf5\uac1c \uc9c4\uc785 \uacbd\ub85c', replacement: '\uacf5\uac1c \uc548\ub0b4 \ub9c1\ud06c' },
  { term: '\ud234\ud301 API', replacement: '\ud55c\uad6d\uc5b4 \uacf5\uc2dd \ud234\ud301' },
  { term: 'API(locale=1)', replacement: '\ud55c\uad6d\uc5b4 \uacf5\uc2dd \ud234\ud301' },
  { term: '\uba54\ucee4\ub2c8\uc998', replacement: '\uc791\ub3d9 \ubc29\uc2dd' },
  { term: '\uc791\uc131 \uc644\ub8cc', replacement: '\ud604\uc7ac \ud328\uce58 \uacf5\ub7b5 \uc0c1\ud0dc' },
  { term: '\ucd08\uc548', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: '\ucc28\ud2b8 \uc0ac\uc6a9', replacement: '\ud655\uc778\ud45c/\uc2e4\uc804 \ud310\ub2e8' },
  { term: '\ucc28\ud2b8 \uc124\uacc4', replacement: '\ud655\uc778\ud45c/\uc2e4\uc804 \ud310\ub2e8' },
  { term: '\uc2dc\uac01\uc790\ub8cc \uad6c\uc131', replacement: '\ud655\uc778\ud45c/\uc2e4\uc804 \ud310\ub2e8' },
  { term: '\ucc28\ud2b8\ub294 \uc5b4\ub514\uc5d0', replacement: '\ud655\uc778\ud45c/\uc2e4\uc804 \ud310\ub2e8' },
  { term: '\uc784\uc758 \ubc88\uc5ed', replacement: '\uacf5\uc2dd \ud55c\uad6d\uc5b4 \ud45c\uae30' },
  { term: '\uc601\ubb38 \ub77c\ubca8', replacement: '\uacf5\uc2dd \ud55c\uad6d\uc5b4 \ud45c\uae30' },
  { term: '\ud234\ud301\uc640', replacement: '\ud234\ud301\uacfc' },
  { term: '\ud655\uc778\uac00', replacement: '\ud655\uc778\uc774' },
  { term: '\uae30\uc900\uac12', replacement: '\uae30\uc900' },
  { term: '\uc785\ub825\uac12', replacement: '\uc7ac\ub8cc/\uc218\ub2e8' },
  { term: '\uae30\ubcf8\uce35', replacement: '\uae30\ubcf8 \ubc14\ud0d5' },
  { term: '\uc678\ud53c', replacement: '\ubcf4\uc870 \ubc29\uc5b4\uae30' },
  { term: '\ud2b8\ub9ac\uc544\uc9c0', replacement: '\uae09\ub77d \ub300\uc751/\ub300\uc0c1 \ubcf5\uad6c' },
  { term: '\uc624\ud504\ub108', replacement: '\uc624\ud504\ub2dd' },
  { term: '\uc624\ud504\ub2dd \ub51c\uc0ac\uc774\ud074', replacement: '\uc624\ud504\ub2dd \uc804\ud22c \ud750\ub984' },
  { term: '\ub85c\ud14c\uc774\uc158', replacement: '\ub51c\uc0ac\uc774\ud074' },
  { term: '\ubc84\uc2a4\ud2b8', replacement: '\uadf9\ub51c' },
  { term: '\uc708\ub3c4\uc6b0', replacement: '\uad6c\uac04' },
  { term: '\ud0c0\uac9f', replacement: '\ub300\uc0c1' },
  { term: '\ud0c0\uae43', replacement: '\ub300\uc0c1' },
  { term: '\ub7a8\ub364\uc131', replacement: '\ubb34\uc791\uc704\uc131/\ubb34\uc791\uc704' },
  { term: '\ub7a8\ud504', replacement: '\uc608\uc5f4/\uc900\ube44 \uacfc\uc815' },
  { term: '\ucd94\ucc9c \uc804\ubb38\ud654+\uc601\uc6c5 \ube4c\ub4dc', replacement: '\ucd94\ucc9c \ud2b9\uc131 \uc870\ud569' },
  { term: '\uc804\ubb38\ud654+\uc601\uc6c5 \ube4c\ub4dc', replacement: '\ub300\ud45c \ube4c\ub4dc' },
  { term: '\uc774 \ud398\uc774\uc9c0\uc758 \uc911\uc2ec', replacement: '\uadf8\ub798\ud504\uc758 \uc911\uc2ec/\ud575\uc2ec' },
  { term: 'KST', replacement: '\ud55c\uad6d \uc2dc\uac04' },
  { term: 'Discord', replacement: '\ub514\uc2a4\ucf54\ub4dc' },
  { term: '\ucc44\uc6b0\uae30 \uae30\uc220', replacement: '\ud544\ub7ec' },
  { term: '\ub418\uba39\uc784', replacement: '\ucffc\uae30 \ud658\uae09' },
  { term: 'filler', replacement: '\ud544\ub7ec' },
  { term: 'Midnight', replacement: '\ud55c\ubc24' },
  { term: 'Stage 1', replacement: '1\ub2e8\uacc4' },
  { term: 'Stage 2', replacement: '2\ub2e8\uacc4' },
  { term: 'Stage 3', replacement: '3\ub2e8\uacc4' },
  { term: 'TODO', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: 'FIXME', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: 'prototype', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
  { term: 'draft', replacement: '\uc0ac\uc6a9\uc790 \ud45c\uc2dc\uc5d0\uc11c \uc81c\uac70' },
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

const pageForbiddenTerms = [
  { term: '\uc5c5\ud0c0\uc784', replacement: '\uc720\uc9c0\uc728/\uc720\ud6a8 \uc2dc\uac04' },
  { term: '\uc624\ud504\ub108', replacement: '\uc624\ud504\ub2dd' },
  { term: '\ub85c\ud14c\uc774\uc158', replacement: '\ub51c\uc0ac\uc774\ud074' },
  { term: '\ubc84\uc2a4\ud2b8', replacement: '\uadf9\ub51c' },
  { term: '\ud0c0\uac9f', replacement: '\ub300\uc0c1' },
  { term: '\ud0c0\uae43', replacement: '\ub300\uc0c1' },
  { term: '\ud2b8\ub9ac\uc544\uc9c0', replacement: '\uae09\ub77d \ub300\uc751/\ub300\uc0c1 \ubcf5\uad6c' },
  { term: '\uc815\ub82c \ub808\uc778', replacement: '\ub9de\ucd94\uae30 \ud45c/\uad6c\uac04' },
  { term: '\ub7a8\ub364\uc131', replacement: '\ubb34\uc791\uc704\uc131/\ubb34\uc791\uc704' },
];

const awkwardContextPatterns = [
  {
    pattern: /(피해|극딜|큰|짧은|쿨기|강화|회복|치유|생존|마나 회복|공허|균열|소환수|폭군|일월식|악마화|소비|준비|전환|분기|처형|독|광역|단일|파티|아군|공대|첫|긴|속죄|발화|평온|후광|폭풍수호자|사형 선고|얼음 기둥|비전|용의 분노|절정|지원)\s*창/g,
    replacement: '\uad6c\uac04/\ud0c0\uc774\ubc0d',
  },
  {
    pattern: /창\s*(안|전|후|내부|중|진입|활성|밀도|준비|유지|배치|소비|사용|보강|가치|공백|손실|계획|대기|종료|흐름|연결|전환|회수|누수|낭비)/g,
    replacement: '\uad6c\uac04/\ud0c0\uc774\ubc0d',
  },
];

const allowedWindowTerms = /얼음창|창끝|표창|투창병|창공의 힘|용사의 창|생명석 창조|영혼의 샘 창조|창조/;

function findLine(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function collectForbiddenTermErrors(filePath, terms) {
  const source = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  for (const item of terms) {
    let index = source.indexOf(item.term);
    while (index !== -1) {
      errors.push({
        filePath,
        line: findLine(source, index),
        term: item.term,
        replacement: item.replacement,
      });
      index = source.indexOf(item.term, index + item.term.length);
    }
  }

  return errors;
}

function collectAwkwardContextErrors(filePath, patterns) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const errors = [];

  lines.forEach((line, index) => {
    if (line.includes('.replace(/') || allowedWindowTerms.test(line)) return;

    for (const item of patterns) {
      item.pattern.lastIndex = 0;
      if (!item.pattern.test(line)) continue;

      errors.push({
        filePath,
        line: index + 1,
        term: item.pattern.toString(),
        replacement: item.replacement,
      });
    }
  });

  return errors;
}

function collectStandaloneWindowTermErrors(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const errors = [];
  const standaloneWindowTerm = /(^|[^\uAC00-\uD7A3])\uCC3D(?!\uB05D)/;

  lines.forEach((line, index) => {
    if (!standaloneWindowTerm.test(line)) return;

    errors.push({
      filePath,
      line: index + 1,
      term: '\uCC3D',
      replacement: '\uAD6C\uAC04/\uD0C0\uC774\uBC0D',
    });
  });

  return errors;
}

function main() {
  const errors = [
    ...collectForbiddenTermErrors(MANUSCRIPT_PATH, forbiddenTerms),
    ...collectForbiddenTermErrors(GUIDE_REGISTRY_PATH, forbiddenTerms),
    ...collectForbiddenTermErrors(GUIDE_DETAIL_PATH, pageForbiddenTerms),
    ...collectStandaloneWindowTermErrors(MANUSCRIPT_PATH),
    ...collectAwkwardContextErrors(GUIDE_DETAIL_PATH, awkwardContextPatterns),
  ];

  if (errors.length) {
    console.error(`Guide copy validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    errors.slice(0, 40).forEach(error => {
      console.error(`  - ${path.relative(SITE_ROOT, error.filePath)}:${error.line}: "${error.term}" -> "${error.replacement}"`);
    });
    if (errors.length > 40) {
      console.error(`  ... and ${errors.length - 40} more`);
    }
    process.exit(1);
  }

  console.log('Guide copy validation passed');
}

main();
