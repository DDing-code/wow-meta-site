#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const GUIDE_REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const GUIDE_DETAIL_PATH = path.join(SITE_ROOT, 'src', 'pages', 'GuideDetailPage.js');
const MOCKUPS_PATH = path.join(SITE_ROOT, 'src', 'pages', 'MockupsPage.js');

const forbiddenTerms = [
  { term: '고가치', replacement: '강한/우선순위 높은' },
  { term: '영웅 특성 분기', replacement: '영웅 특성 선택지' },
  { term: '품질 게이트', replacement: '검수 게이트' },
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
  { term: '\ud45c\ubcf8', replacement: '\ub85c\uadf8' },
  { term: '\uacbd\uc81c', replacement: '\uad00\ub9ac' },
  { term: '\uc804\uc5ed \uc7ac\uc0ac\uc6a9 \ub300\uae30\uc2dc\uac04', replacement: '\uae00\ucfe8' },
  { term: '\uc804\uc5ed', replacement: '\uae00\ucfe8' },
  { term: '\uae00\ub85c\ubc8c', replacement: '\uae00\ucfe8' },
  { term: '\ub300\uc0c1\ub9dd', replacement: '\ub300\uc0c1 \uc900\ube44/\ub300\uc0c1 \uc720\uc9c0' },
  { term: '\ub300\uc0c1 \ubc30\uce58', replacement: '\ub300\uc0c1 \uc720\uc9c0/\ub300\uc0c1 \uc9c0\uc815/\ub300\uc0c1 \uc900\ube44' },
  { term: '\ub300\uc0c1 \ubc30\uce58\uac00\uace0', replacement: '\ub300\uc0c1 \uc900\ube44\uac00 \ub418\uace0/\ud53c\ud574 \uc804 \ub300\uc0c1 \uc900\ube44' },
  { term: '\ub300\uc0c1 \ubc30\uce58\uac00\ubbc0\ub85c', replacement: '\ub300\uc0c1 \uc900\ube44\uac00 \ub418\ubbc0\ub85c/\ud53c\ud574 \uc804 \ub300\uc0c1 \uc900\ube44' },
  { term: '\uae30\ubcf8 \uc124\uba85', replacement: '\uae30\ubcf8 \uc6b4\uc6a9' },
  { term: '\uacf5\ud1b5 \uc124\uba85', replacement: '\uacf5\ud1b5 \uc6b4\uc6a9' },
  { term: '\ud45c\uc900 \uc124\uba85', replacement: '\uae30\ubcf8 \uc6b4\uc6a9' },
  { term: '\ud398\uc774\uc9c0 \ucc98\ub9ac', replacement: '\uac00\uc774\ub4dc \ud45c\ud604\uc73c\ub85c \uc218\uc815' },
  { term: '\ubcf4\uc870 \uc2dc\uac01\uc790\ub8cc', replacement: '\ubcf4\uc870 \ucc28\ud2b8/\ud655\uc778\ud45c' },
  { term: '\uc2dc\uac01\ud654', replacement: '\ubcf4\uc5ec\uc8fc\ub294 \ucc28\ud2b8/\ud45c\ud604' },
  { term: '\uc2e4\uc81c HPS \ubcf5\uc0ac\ubcf8', replacement: 'HPS \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uc2e4\uc81c HPS \ucd08 \ub2e8\uc704 \ubcf5\uc0ac\ubcf8', replacement: 'HPS \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uc2e4\uc81c WCL \uc218\uce58\ub97c \ubcf5\uc0ac', replacement: 'WCL \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uae00\ucfe8 \ub300\uae30\uc2dc\uac04', replacement: '\uae00\ucfe8' },
  { term: '\uae00\ucfe8 \ud234\ud301', replacement: '\ud234\ud301 \ud56d\ubaa9' },
  { term: '\uc7ac\uc0ac\uc6a9 \ub300\uae30\uc2dc\uac04', replacement: '\ucfe8\ub2e4\uc6b4' },
  { term: '\ub204\ub974\ub294 \ubc84\ud2bc', replacement: '\uc4f0\ub294 \uc2a4\ud0ac/\uc9c1\uc811 \uc4f0\ub294 \uc2a4\ud0ac' },
  { term: '\uc751\uae09 \ubc84\ud2bc', replacement: '\uc751\uae09\uae30' },
  { term: '\uc608\uc57d \ubc84\ud2bc', replacement: '\ubbf8\ub9ac \uc7a1\uc544\ub450\ub294 \uc2a4\ud0ac' },
  { term: '\uacc4\ud68d \ubc84\ud2bc', replacement: '\uacc4\ud68d\uc6a9 \uc2a4\ud0ac' },
  { term: '\ud53c\ud574 \ubc84\ud2bc', replacement: '\ub51c \uc2a4\ud0ac' },
  { term: '\uacf5\uaca9 \ubc84\ud2bc', replacement: '\uacf5\uaca9 \uc2a4\ud0ac' },
  { term: '\ubc29\uc5b4 \ubc84\ud2bc', replacement: '\ubc29\uc5b4\uae30' },
  { term: '\uc0dd\uc874 \ubc84\ud2bc', replacement: '\uc0dd\uc874\uae30' },
  { term: '\ub51c \ubc84\ud2bc', replacement: '\ub51c \uc2a4\ud0ac' },
  { term: '\ud544\ub7ec \ubc84\ud2bc', replacement: '\ud544\ub7ec' },
  { term: '\uc704\uce58 \ubc84\ud2bc', replacement: '\uc704\uce58 \uc870\uc808\uae30' },
  { term: '\ud070 \ubc84\ud2bc', replacement: '\ud070 \ucffc\uae30' },
  { term: '\uc644\uc8fc\uc728', replacement: '\ub05d\uae4c\uc9c0 \uc2dc\uc804\ud588\ub294\uc9c0' },
  { term: '\ucfe8\uae30\uc774', replacement: '\ucfe8\uae30\uac00/\ucfe8\uae30\uc9c0\ub9cc' },
  { term: '\ucfe8\uae30\uc744', replacement: '\ucfe8\uae30\ub97c' },
  { term: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uc774', replacement: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uac00' },
  { term: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uc744', replacement: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\ub97c' },
  { term: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uacfc', replacement: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uc640' },
  { term: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\uc740', replacement: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790\ub294' },
  { term: '\ud55c\ubc24 \ubcf4\uc874', replacement: '\ud604\uc7ac \ubcf4\uc874' },
  { term: '\ud53c\ud574\ub97c \ub298\ub824 \ubc1b\uac8c', replacement: '\ud070 \ud53c\ud574\ub97c \ub098\ub220 \ubc1b\uac8c' },
  { term: '\uc9c1\uc811 \ud53c\ud574 \uac15\ud654', replacement: '\ub2e4\uc74c \uc9c1\uc811 \ud53c\ud574\ub97c \uac15\ud654\ud558\ub294 \ubc84\ud504' },
  { term: '\uc804\ud22c \uc5b8\uc5b4', replacement: '\uc2e4\uc804 \ud45c\ud604\uc73c\ub85c \uc218\uc815' },
  { term: '\uc9c8\uc744 \uad00\ub9ac', replacement: '\ud53c\ud574 \uad6c\uac04\uc744 \uae54\ub054\ud558\uac8c \uc5ec\ub294 \uc21c\uc11c' },
  { term: 'proactive tank', replacement: '\uc0ac\uc804 \uc900\ube44\ud615 \ud0f1\ucee4' },
  { term: 'raid healer', replacement: '\ub808\uc774\ub4dc \ud790\ub7ec' },
  { term: 'uptime', replacement: '\uc720\uc9c0\uc728/\uc720\ud6a8 \uc2dc\uac04' },
  { term: '\ub85c\uadf8\uc774', replacement: '\ub85c\uadf8\uac00' },
  { term: '\ub85c\uadf8\uc740', replacement: '\ub85c\uadf8\ub294' },
  { term: '\ub85c\uadf8\uc744', replacement: '\ub85c\uadf8\ub97c' },
  { term: '\ub85c\uadf8\uacfc', replacement: '\ub85c\uadf8\uc640' },
  { term: '\ub85c\uadf8 \ub85c\uadf8', replacement: '\ub85c\uadf8' },
  { term: '\ubc00\ub3c4', replacement: '\uc0ac\uc6a9 \ud69f\uc218/\uad6c\uac04 \uc644\uc131\ub3c4' },
  { term: '\ub3c4\uc2dd', replacement: '\ud750\ub984\ub3c4' },
  { term: '\uc644\ud654\uce35', replacement: '\uc644\ud654 \uc218\ub2e8' },
  { term: '\ubc29\uc5b4\uce35', replacement: '\ubc29\uc5b4 \uc218\ub2e8' },
  { term: '\ud761\uc218\uce35', replacement: '\ud761\uc218\ub9c9' },
  { term: '\ubc14\ub2e5\uce35', replacement: '\uae30\ubcf8 \uc548\uc804\ub9dd' },
  { term: '\uc774\uc5b4\uac10', replacement: '\uc774\uc5b4 \uac10/\uc720\uc9c0' },
  { term: '\ub294\uc9c0\uc744', replacement: '\ub294\uc9c0\ub97c' },
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
  { term: '\uc774 \ud398\uc774\uc9c0', replacement: '\uc774 \uac00\uc774\ub4dc' },
  { term: '\uc774 \uae00', replacement: '\uc774 \uac00\uc774\ub4dc' },
  { term: '\ud53c\ud574 \ud504\ub85c\ud544', replacement: '\ud53c\ud574 \uc131\uaca9' },
  { term: '\ud53c\ud574 \ubaa8\uc591', replacement: '\ud53c\ud574 \ud328\ud134' },
  { term: '\ud53c\ud574 \uc22b\uc790', replacement: '\ub51c\ub7c9' },
  { term: '\ub51c \uc804\uc5ed', replacement: '\ub51c \uae00\ucfe8/\uc720\ud2f8' },
  { term: '\ucee4\ubc84\ub9ac\uc9c0', replacement: '\ub300\uc0c1 \uc720\uc9c0/\uc720\uc9c0 \ubc94\uc704' },
  { term: '\uc8fd\ub294 \uc774\uc720', replacement: '\uc0ac\ub9dd \uc6d0\uc778' },
  { term: 'SimulationCraft \ud504\ub85c\ud544', replacement: 'SimulationCraft \uc124\uc815' },
  { term: '\ud45c\uc900 \ubcf8\ubb38', replacement: '\ud45c\uc900 \uc124\uba85' },
  { term: '\uacf5\ud1b5 \ubcf8\ubb38', replacement: '\uacf5\ud1b5 \uc124\uba85' },
  { term: '\uae30\ubcf8 \ubcf8\ubb38', replacement: '\uae30\ubcf8 \uc124\uba85' },
  { term: '\uc2e4\ud328 \ubaa8\ub4dc', replacement: '\uc790\uc8fc \ub098\ub294 \uc2e4\uc218' },
  { term: '\uac00\uc774\ub4dc\uc740', replacement: '\uac00\uc774\ub4dc\ub294' },
  { term: '\uc124\uba85\uc73c\ub85c \uc124\uba85', replacement: '\ud750\ub984\uc73c\ub85c \ub450\uace0' },
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
  { term: "Elune's Chosen", replacement: '\uc5d8\ub8ec\uc758 \ub300\ud589\uc790' },
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
  { term: '\uc2e4\ud328 \ubaa8\ub4dc', replacement: '\uc790\uc8fc \ub098\ub294 \uc2e4\uc218' },
  { term: '\ud575\uc2ec \uba85\uc81c', replacement: '\ud575\uc2ec \uc694\uc57d' },
  { term: '\uc6b4\uc6a9 \ubaa8\ub378', replacement: '\uc6b4\uc6a9' },
  { term: '\uac80\uc99d \ubc94\uc704', replacement: '\ucd9c\ucc98 \ud655\uc778' },
  { term: '\ubcf4\uc870 \uc790\ub8cc', replacement: '\uccb4\ud06c\uc6a9' },
  { term: '\ucee4\ubc84\ub9ac\uc9c0', replacement: '\ub300\uc0c1 \uc720\uc9c0/\uc720\uc9c0 \ubc94\uc704' },
  { term: '\ud45c\ubcf8', replacement: '\ub85c\uadf8' },
  { term: '\uacbd\uc81c', replacement: '\uad00\ub9ac' },
  { term: '\uc804\uc5ed \uc7ac\uc0ac\uc6a9 \ub300\uae30\uc2dc\uac04', replacement: '\uae00\ucfe8' },
  { term: '\uc804\uc5ed', replacement: '\uae00\ucfe8' },
  { term: '\uae00\ub85c\ubc8c', replacement: '\uae00\ucfe8' },
  { term: '\ub300\uc0c1\ub9dd', replacement: '\ub300\uc0c1 \uc900\ube44/\ub300\uc0c1 \uc720\uc9c0' },
  { term: '\ub300\uc0c1 \ubc30\uce58', replacement: '\ub300\uc0c1 \uc720\uc9c0/\ub300\uc0c1 \uc9c0\uc815/\ub300\uc0c1 \uc900\ube44' },
  { term: '\ub300\uc0c1 \ubc30\uce58\uac00\uace0', replacement: '\ub300\uc0c1 \uc900\ube44\uac00 \ub418\uace0/\ud53c\ud574 \uc804 \ub300\uc0c1 \uc900\ube44' },
  { term: '\ub300\uc0c1 \ubc30\uce58\uac00\ubbc0\ub85c', replacement: '\ub300\uc0c1 \uc900\ube44\uac00 \ub418\ubbc0\ub85c/\ud53c\ud574 \uc804 \ub300\uc0c1 \uc900\ube44' },
  { term: '\uae30\ubcf8 \uc124\uba85', replacement: '\uae30\ubcf8 \uc6b4\uc6a9' },
  { term: '\uacf5\ud1b5 \uc124\uba85', replacement: '\uacf5\ud1b5 \uc6b4\uc6a9' },
  { term: '\ud45c\uc900 \uc124\uba85', replacement: '\uae30\ubcf8 \uc6b4\uc6a9' },
  { term: '\ud398\uc774\uc9c0 \ucc98\ub9ac', replacement: '\uac00\uc774\ub4dc \ud45c\ud604\uc73c\ub85c \uc218\uc815' },
  { term: '\ubcf4\uc870 \uc2dc\uac01\uc790\ub8cc', replacement: '\ubcf4\uc870 \ucc28\ud2b8/\ud655\uc778\ud45c' },
  { term: '\uc2dc\uac01\ud654', replacement: '\ubcf4\uc5ec\uc8fc\ub294 \ucc28\ud2b8/\ud45c\ud604' },
  { term: '\uc2e4\uc81c HPS \ubcf5\uc0ac\ubcf8', replacement: 'HPS \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uc2e4\uc81c HPS \ucd08 \ub2e8\uc704 \ubcf5\uc0ac\ubcf8', replacement: 'HPS \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uc2e4\uc81c WCL \uc218\uce58\ub97c \ubcf5\uc0ac', replacement: 'WCL \ud0c0\uc784\ub77c\uc778\uc744 \uadf8\ub300\ub85c \ubca0\ub080 \ud45c\ud604 \uae08\uc9c0' },
  { term: '\uae00\ucfe8 \ub300\uae30\uc2dc\uac04', replacement: '\uae00\ucfe8' },
  { term: '\uae00\ucfe8 \ud234\ud301', replacement: '\ud234\ud301 \ud56d\ubaa9' },
  { term: '\uc7ac\uc0ac\uc6a9 \ub300\uae30\uc2dc\uac04', replacement: '\ucfe8\ub2e4\uc6b4' },
  { term: '\ub204\ub974\ub294 \ubc84\ud2bc', replacement: '\uc4f0\ub294 \uc2a4\ud0ac/\uc9c1\uc811 \uc4f0\ub294 \uc2a4\ud0ac' },
  { term: '\uc751\uae09 \ubc84\ud2bc', replacement: '\uc751\uae09\uae30' },
  { term: '\uc608\uc57d \ubc84\ud2bc', replacement: '\ubbf8\ub9ac \uc7a1\uc544\ub450\ub294 \uc2a4\ud0ac' },
  { term: '\uacc4\ud68d \ubc84\ud2bc', replacement: '\uacc4\ud68d\uc6a9 \uc2a4\ud0ac' },
  { term: '\ud53c\ud574 \ubc84\ud2bc', replacement: '\ub51c \uc2a4\ud0ac' },
  { term: '\uacf5\uaca9 \ubc84\ud2bc', replacement: '\uacf5\uaca9 \uc2a4\ud0ac' },
  { term: '\ubc29\uc5b4 \ubc84\ud2bc', replacement: '\ubc29\uc5b4\uae30' },
  { term: '\uc0dd\uc874 \ubc84\ud2bc', replacement: '\uc0dd\uc874\uae30' },
  { term: '\ub51c \ubc84\ud2bc', replacement: '\ub51c \uc2a4\ud0ac' },
  { term: '\ud544\ub7ec \ubc84\ud2bc', replacement: '\ud544\ub7ec' },
  { term: '\uc704\uce58 \ubc84\ud2bc', replacement: '\uc704\uce58 \uc870\uc808\uae30' },
  { term: '\ud070 \ubc84\ud2bc', replacement: '\ud070 \ucffc\uae30' },
  { term: '\uc644\uc8fc\uc728', replacement: '\ub05d\uae4c\uc9c0 \uc2dc\uc804\ud588\ub294\uc9c0' },
  { term: '\ub85c\uadf8\uc774', replacement: '\ub85c\uadf8\uac00' },
  { term: '\ub85c\uadf8\uc740', replacement: '\ub85c\uadf8\ub294' },
  { term: '\ub85c\uadf8\uc744', replacement: '\ub85c\uadf8\ub97c' },
  { term: '\ub85c\uadf8\uacfc', replacement: '\ub85c\uadf8\uc640' },
  { term: '\ub85c\uadf8 \ub85c\uadf8', replacement: '\ub85c\uadf8' },
  { term: '\ubc00\ub3c4', replacement: '\uc0ac\uc6a9 \ud69f\uc218/\uad6c\uac04 \uc644\uc131\ub3c4' },
  { term: '\ub3c4\uc2dd', replacement: '\ud750\ub984\ub3c4' },
  { term: '\uc644\ud654\uce35', replacement: '\uc644\ud654 \uc218\ub2e8' },
  { term: '\ubc29\uc5b4\uce35', replacement: '\ubc29\uc5b4 \uc218\ub2e8' },
  { term: '\ud761\uc218\uce35', replacement: '\ud761\uc218\ub9c9' },
  { term: '\ubc14\ub2e5\uce35', replacement: '\uae30\ubcf8 \uc548\uc804\ub9dd' },
  { term: '\uc774\uc5b4\uac10', replacement: '\uc774\uc5b4 \uac10/\uc720\uc9c0' },
  { term: '\ub294\uc9c0\uc744', replacement: '\ub294\uc9c0\ub97c' },
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

function collectForbiddenTermErrors(filePath, terms) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const errors = [];

  lines.forEach((line, lineIndex) => {
    if (line.includes('.replace(/')) return;

    for (const item of terms) {
      let index = line.indexOf(item.term);
      while (index !== -1) {
        errors.push({
          filePath,
          line: lineIndex + 1,
          term: item.term,
          replacement: item.replacement,
        });
        index = line.indexOf(item.term, index + item.term.length);
      }
    }
  });

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
    ...collectForbiddenTermErrors(MOCKUPS_PATH, pageForbiddenTerms),
    ...collectForbiddenTermErrors(MOCKUPS_PATH, forbiddenTerms.slice(0, 3)),
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
