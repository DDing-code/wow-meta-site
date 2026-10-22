// KB 레이드 가이드 정본에 스토리보드 배치도(컷 번호)·네임드 스프라이트를 연결한다. 다시 돌려도 같은 결과.
const fs = require('node:fs');
const path = require('node:path');
const KB = path.resolve(__dirname, '../../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/00-공통/공용/Meta/raid-guide.json');
const SCENES = 'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythic-raid-storyboard-20261022/plan/scenes.json';
const scenes = JSON.parse(fs.readFileSync(SCENES, 'utf8'));
const guide = JSON.parse(fs.readFileSync(KB, 'utf8'));
const fig = key => {
  const scene = scenes[key];
  if (!scene) throw new Error(`no scene ${key}`);
  return { plan: key, caption: scene.caption };
};
const shots = (prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}-${String(from + i).padStart(2, '0')}`);
// 네임드별: [스프라이트, 개요 컷, 행동 순서대로 붙일 컷(null = 그림 없음), 복습 컷]
const plan = {
  kithix: [['kithix'], null, [...shots('01-kithix', 1, 11), null], '01-kithix-12'],
  nymrissa: [['nymrissa'], null, shots('02-nymrissa', 1, 9), null],
  nekzali: [['nekzali'], null, shots('03-venomous-1-6', 2, 5), null],
  sentinels: [['sentinel_g', 'sentinel_r'], null, [...shots('03-venomous-1-6', 6, 9), null], null],
  explorers: [['nama', 'gebbo', 'iku'], null, shots('03-venomous-1-6', 10, 13), null],
  vashnik: [['vashnik'], null, shots('03-venomous-1-6', 14, 17), null],
  sszorak: [['sszorak'], null, shots('03-venomous-1-6', 18, 21), null],
  fangs: [['fang_g', 'fang_r'], null, shots('03-venomous-1-6', 22, 25), null],
  'coiled-altar': [['zuljan', 'malakras'], '04-coiled-altar-01', shots('04-coiled-altar', 2, 11), '04-coiled-altar-12'],
  ulatek: [['hydra', 'tail'], '05-ulatek-01', shots('05-ulatek', 2, 14), '05-ulatek-15'],
};
const used = new Set();
const take = key => { if (used.has(key)) throw new Error(`dup ${key}`); used.add(key); return fig(key); };
for (const episode of guide.episodes) {
  delete episode.figure; delete episode.recap;
  if (episode.id === 'venomous-1-6') { episode.figure = take('03-venomous-1-6-01'); episode.recap = take('03-venomous-1-6-26'); }
  for (const boss of episode.bosses) {
    const [sprites, overview, stepShots, recap] = plan[boss.id];
    boss.sprites = sprites;
    delete boss.figure; delete boss.recap;
    if (overview) boss.figure = take(overview);
    const steps = boss.phases.flatMap(p => p.steps);
    if (steps.length !== stepShots.length) throw new Error(`${boss.id}: ${steps.length} steps vs ${stepShots.length} shots`);
    steps.forEach((step, i) => { delete step.figure; if (stepShots[i]) step.figure = take(stepShots[i]); });
    if (recap) boss.recap = take(recap);
  }
}
if (used.size !== Object.keys(scenes).length) throw new Error(`used ${used.size} of ${Object.keys(scenes).length}`);
guide.metadata.status = '글과 배치도 공개 · 영상은 준비 중';
guide.metadata.storyboard = 'ai-hub workspace/outputs/mythic-raid-storyboard-20261022 (5편 74컷·팁 108개)의 내레이션·팁을 글로 옮기고, 위에서 본 배치도 74장(plan/)과 네임드 스프라이트를 사이트 public/images/raid에 WebP로 넣었다. 배치도의 전장 바탕 10장은 2026-10-22 raidstrats.gg 플래너의 실제 위에서 본 지도를 참고 그림으로 붙여 같은 윤곽·바닥 문양으로 다시 그렸다(예전 판은 assets/arenas/_before-real). 영상은 다음 단계.';
fs.writeFileSync(KB, JSON.stringify(guide, null, 2) + '\n');
console.log('figures', used.size);
// 기준과 한계 안내도 현재 상태로 맞춘다.
{
  const g = JSON.parse(fs.readFileSync(KB, 'utf8'));
  const old = '이 글은 영상용 스토리보드(5편 74컷)의 내용을 글로 먼저 옮긴 것입니다. 위에서 본 배치도와 영상은 다음 단계에서 붙습니다.';
  const mid = '이 글은 영상용 스토리보드(5편 74컷)의 내용을 글로 옮기고, 컷마다 그린 위에서 본 배치도를 해당 행동 옆에 붙인 것입니다. 배치도의 자리·인원은 예시이며, 영상은 다음 단계에서 붙습니다.';
  // 2026-10-22 전장 바탕을 실제 지도대로 다시 그린 뒤의 문구
  const now = '이 글은 영상용 스토리보드(5편 74컷)의 내용을 글로 옮기고, 컷마다 그린 위에서 본 배치도를 해당 행동 옆에 붙인 것입니다. 배치도의 전장 모양과 바닥 문양은 실제 게임의 위에서 본 지도를 따라 그렸고, 자리·인원은 예시입니다. 영상은 다음 단계에서 붙습니다.';
  g.basisNotes = g.basisNotes.map(note => (note === old || note === mid ? now : note));
  if (!g.basisNotes.includes(now)) throw new Error('basis note not updated');
  fs.writeFileSync(KB, JSON.stringify(g, null, 2) + '\n');
}
