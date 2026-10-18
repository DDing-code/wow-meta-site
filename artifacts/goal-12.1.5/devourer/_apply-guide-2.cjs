// 2차: 조율 지시(특성 견본 3개 모두 궤멸자) + Wowhead 특성(10/13)·운용(10/14)·Icy Veins(12.1.5판) 근거로 궤멸자 우선 재배치.
// 검사기(validate-guide-manuscripts.js 1712·1717줄) 때문에 heroBranches 배열 순서(0 공허상흔, 1 궤멸자)는 유지한다.
// blocks·book·patch·status·talentBuilds 는 건드리지 않는다.
const fs = require('fs');
const FILE = 'C:/wowmeta/kb/08-직업별-Knowledge-Base/02-악마사냥꾼/포식/Meta/guide-12.1.json';
const g = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const before = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };
const clone = x => JSON.parse(JSON.stringify(x));

// ── 궤멸자 단일 오프닝 (Wowhead 10/14 표본 + SimC 10/13 탈태 밖 공허칼날 줄) ──
const anOpener = {
  title: '궤멸자 단일 첫 진입 전투 흐름',
  summary: '단일 네임드 기준의 첫 진입입니다. 10월 13일 변경 뒤 갱신된 Wowhead 표본 타임라인(10월 14일)을 따르고, 포식자의 이빨을 골랐을 때의 진입 직전 공허칼날은 SimulationCraft 기본 우선순위(10월 13일)에서 가져왔습니다. 공허내림 발동에 따라 중간 생성기 횟수는 달라집니다. 영혼 탐식과 한밤 최종 노드 선택 여부도 구분합니다.',
  steps: [
    { skillId: '1241937', label: '영혼 제물', phase: '전투 전', trigger: '풀링 약 2초 전', note: '격노 30과 파편 3개가 5초에 걸쳐 들어옵니다. 타이머를 확인해 선풀하지 않도록 준비합니다.' },
    { skillId: '473662', label: '흡수', phase: '첫 생성', trigger: '풀링 약 1초 전', note: '격노와 파편을 생성하며 첫 진입 조건을 만듭니다.' },
    { skillId: '1226019', label: '수확', phase: '파편 회수', trigger: '4개 이상 회수 가능', note: '흡수와 번갈아 기본 50 또는 영혼 탐식 35영혼 진입 조건을 채웁니다. 공허내림 3중첩이면 수확으로 소비합니다.' },
    { skillId: '473728', label: '공허 광선', phase: '격노 소비', trigger: '외부 격노 100', note: '안전하게 완주하고 광선이 만든 파편을 다시 거둡니다.' },
    { skillId: '1245412', label: '공허칼날', phase: '진입 직전', trigger: '포식자의 이빨 선택 · 영혼이 다 찼을 때', note: '포식자의 이빨로 대상이 받는 피해를 높인 뒤 들어갑니다(SimulationCraft 10월 13일). 이 특성을 고르지 않았다면 건너뜁니다. 공허상흔 전용 근접 강화 기술 셋을 그대로 복사하지 않습니다.' },
    { skillId: '471306', label: '공허 탈태', phase: '내부 진입', trigger: '요구 영혼 충족', note: '진입 시 격노가 채워집니다. 한밤 마지막 단계까지 찍었다면 영혼 파편 5개와 즉시 붕괴하는 별이 생깁니다.' },
    { skillId: '473728', label: '공허 광선', phase: '탈태 첫 광선', trigger: '진입 직후', note: '탈태 안 광선은 격노를 쓰지 않고 격노 소모를 멈춥니다. 영혼이 넘치지 않으면 바로 씁니다.' },
    { skillId: '1221167', label: '붕괴하는 별', phase: '별의 첫 기회', trigger: '탈태 중 영혼 30개 또는 한밤 최종 노드', note: '기본 비용은 30영혼입니다. 피할 패턴이 오면 끊어도 5초 쿨다운이 걸리지 않습니다.' },
    { skillId: '1245453', label: '도태', phase: '내부 회수', trigger: '4개 이상 회수', note: '다음 별에 쓸 파편을 거두고 공허내림 3중첩을 소비합니다. 박멸을 골랐다면 광선 뒤에는 박멸로 나갑니다.' },
    { skillId: '1217610', label: '집어삼키기', phase: '다음 자원', trigger: '다음 별·광선 사이', note: '격노 생성과 도태 쿨다운 감소를 활용합니다. 공허상흔 광역의 빠른 종료를 복사하지 않습니다.' },
  ],
};
const anSingle = [
  { skillId: '1217610', label: '발동 집어삼키기', note: '영혼분출을 발동시킬 때 먼저 씁니다(Wowhead 맨 위). 시즌 2 세트 효과가 있을 때만 해당합니다.' },
  { skillId: '473728', label: '공허 광선', note: '영혼이 넘치지 않으면 씁니다(Wowhead). 탈태 안 광선은 격노를 쓰지 않고 격노 소모를 멈추며, 공허정화를 골랐다면 쿨다운이 2.5초 짧습니다.' },
  { skillId: '1221167', label: '붕괴하는 별', note: '탈태 중 영혼 30개를 흡수하면 씁니다. 끊어도 5초 쿨다운이 없지만 격노 소모 감소는 시전 1.5회분까지입니다. 최종 한밤의 진입 보상은 별도로 판단합니다.' },
  { skillId: '1245453', label: '도태', note: '4개 이상 회수할 때 씁니다. 다음 별에 쓸 파편과 공허내림 3중첩 소비를 함께 봅니다.' },
  { skillId: '1245412', label: '공허칼날', note: '포식자의 이빨을 골랐을 때만 씁니다(Wowhead 선택 항목). 대상이 받는 피해 12% 증가를 별과 도태에 겹칩니다.' },
  { skillId: '1217610', label: '집어삼키기', note: '격노를 생성하고 도태 쿨다운을 줄입니다. 시전 생성기이며 즉시 소비기로 표시하지 않습니다.' },
  { skillId: '1241937', label: '영혼 제물', note: '탈태가 끝날 무렵 씁니다(Wowhead·Icy Veins). 별을 쓸 시간을 차지하지 않게 합니다.' },
];
const anAoe = [
  { skillId: '1221167', label: '붕괴하는 별', note: '탈태 중 모은 영혼이 40개를 넘게 될 것 같으면 다른 기술보다 먼저 씁니다(Wowhead 광역 우선순위).' },
  { skillId: '1217610', label: '발동 집어삼키기', note: '해당 시즌 세트의 영혼분출이 있는 때 먼저 씁니다.' },
  { skillId: '1226033', label: '박멸', note: '파편 10개, 또는 공허내림을 발동시킬 수 있으면 4개 이상에서 씁니다. 선택한 박멸이 없다면 이 행을 적용하지 않습니다.' },
  { skillId: '473728', label: '공허 광선', note: '완주할 위치를 확보하고 다음 박멸과 영혼 회수를 준비합니다.' },
  { skillId: '1221167', label: '붕괴하는 별', note: '사용 가능한 별을 씁니다. 광역에서는 별 수가 피해의 중심입니다.' },
  { skillId: '1245453', label: '도태', note: '공허내림을 발동시키거나 다음 별을 열 수 있을 때 씁니다. 파편 생성과 회수를 같은 횟수로 세지 않습니다.' },
  { skillId: '1217610', label: '집어삼키기', note: '격노·내부 유지와 도태 사용 기회를 이어갑니다.' },
  { skillId: '1241937', label: '영혼 제물', note: '탈태가 끝날 무렵 씁니다. 형상 밖의 자원 준비와 필요한 회복에도 씁니다.' },
];

const an = g.heroBranches[1];
if (an.label !== '궤멸자') throw new Error('heroBranches[1] 이 궤멸자가 아님');
an.summary = '이 가이드의 기준 영웅 특성입니다. 붕괴하는 별과 공허내림을 활용하는 원거리 운용으로, 공허 탈태 안에서 필요한 파편을 회수해 붕괴하는 별을 최대한 많이 씁니다. 10월 13일 이후 Wowhead 특성 안내(10월 13일)와 Icy Veins(12.1.5 표기)는 붕괴하는 별 상향과 12.1.5 변경을 이유로 궤멸자를 거의 모든 콘텐츠에 추천합니다. 순서는 Wowhead 운용 가이드(10월 14일)를 기준으로 SimulationCraft 기본 우선순위(10월 13일)와 대조했습니다. 공허상흔처럼 근접 강화 스킬 세 개를 넣는 것이 목표가 아니며, 탈태 종료를 원하는 시점부터 두 빌드는 다릅니다. 한국 검수(레이드 1건·쐐기 1건)는 변경 전 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.';
an.bullets = [
  '오프닝: 영혼 제물·흡수·수확·공허 광선으로 첫 진입을 준비합니다. 포식자의 이빨을 골랐다면 진입 직전 공허칼날을 맞히고, 탈태에 들어가면 공허 광선 → 붕괴하는 별 순서로 엽니다(Wowhead 10월 14일 표본). 한밤 마지막 단계까지 찍었다면 진입 직후 별을 바로 쓸 수 있습니다.',
  '단일 우선순위: 영혼분출 발동 집어삼키기 → 공허 광선(영혼이 넘치지 않으면) → 붕괴하는 별 → 4개 이상 도태 → 공허칼날(포식자의 이빨) → 집어삼키기, 탈태가 끝날 무렵 영혼 제물입니다. 별의 기본 비용은 30영혼입니다.',
  '실수 방지: 공허상흔 광역의 빠른 종료를 따라 하다가 붕괴하는 별을 사용할 시간을 잃지 마세요. 별 시전은 끊어도 5초 쿨다운이 없지만, 끊었다 다시 시작해 탈태를 늘리는 방식은 시전 1.5회분까지만 통합니다.',
  '로그 확인: 탈태마다 붕괴하는 별 횟수(Wowhead 목표 단일 4~5회, 광역 5회 이상), 공허내림에 반응했는지, 공허 광선 채널 중 이동으로 유효 피해가 빠졌는지 점검합니다.',
  '비교 기준: 레이드와 쐐기에서 공허상흔 로그와 스킬 횟수를 직접 비교하지 않습니다. 같은 영웅 특성과 세트 조건, 10월 13일 이후 로그를 구한 뒤 실제 대상 피해로 평가하세요.',
];
an.opener = clone(anOpener);
an.priority = clone(anSingle);
an.singleTarget.summary = '현재 형상 내부 우선순위입니다. Wowhead 운용 가이드(10월 14일)의 궤멸자 단일 순서이며, 형상 외부 생성과 진입 조건은 오프닝·본문을 함께 적용합니다.';
an.singleTarget.priority = clone(anSingle);
an.aoe.summary = '궤멸자 광역은 박멸·공허 광선·붕괴하는 별·공허내림 회수로 탈태 안 공격을 이어 갑니다(Wowhead 10월 14일). 공허상흔의 두 번째 광선 뒤 빠른 종료를 적용하지 않습니다.';
an.aoe.priority = clone(anAoe);

// 공허상흔: 대안으로 표기
const vs = g.heroBranches[0];
vs.summary = vs.summary.replace('같은 시점의 Wowhead·Icy Veins 특성 안내는 공허상흔이 쉽게 흐트러진다는 이유로 궤멸자를 거의 모든 콘텐츠에 추천하므로, 이 흐름은 공허상흔을 고른 경우의 기준입니다.', '같은 시점의 Wowhead·Icy Veins 특성 안내는 공허상흔이 잠재력은 높지만 쉽게 흐트러진다는 이유로 추천하지 않으므로, 이 가이드는 공허상흔을 궤멸자 다음의 대안으로 다룹니다.');
if (!vs.summary.includes('궤멸자 다음의 대안')) throw new Error('공허상흔 요약 치환 실패');
vs.bullets[4] = '선택 기준: 10월 13일 이후 Wowhead·Icy Veins는 궤멸자를 거의 모든 콘텐츠에 추천하고 공허상흔은 추천하지 않습니다. 공허상흔은 근접 이동과 긴 시전이 끊기지 않는 전투에서만 고르고, 실제 자기 전투의 안전한 근접 시간을 함께 봅니다. 포식자의 이빨은 두 영웅 특성 모두 쓸 수 있습니다.';

// 맨 위 우선순위·오프닝 = 궤멸자 단일
g.priority = clone(anSingle);
g.opener = clone(anOpener);

g.summary = '포식은 흡수와 수확으로 격노와 영혼 파편을 모아 공허 탈태에 들어가는 지능 전문화입니다. 이 가이드는 준비 → 원리 → 연습 → 실전 → 심화 순서로 읽도록 짰습니다. 스킬 묶음을 먼저 보고, 두 자원과 탈태의 시작·끝, 공허 광선 완주, 근접 연계, 종료 뒤 보상을 익힌 뒤, 허수아비 타임라인과 궤멸자·공허상흔 운용으로 넘어갑니다. 10월 13일(미국) 적용된 변경 뒤 공개 가이드가 궤멸자를 거의 모든 콘텐츠에 추천해 이 가이드도 궤멸자를 기준으로 삼고, 공허상흔은 근접 강화 기술을 먼저 쓴 뒤 붕괴하는 별로 사냥을 초기화하는 대안으로 다룹니다. 두 영웅 특성 모두 탈태 안에서 붕괴하는 별을 최대한 많이 쓰는 것이 핵심입니다.';

g.sourceStatus = '2026-10-18 12.1.5(10월 13일 미국 적용) 공식 노트·한국어 툴팁과 변경 뒤 갱신된 SimulationCraft·Wowhead·Icy Veins로 영웅 특성 기준(궤멸자)과 두 분기의 딜사이클을 다시 맞춤. 2026-10-10 한국 레이드 2건·쐐기 1건은 변경 전 기록입니다.';

g.playstyle = [
  { label: '궤멸자 레이드 단일', text: '탈태 안에서 공허 광선을 쿨마다 쓰고, 영혼 30개가 모이면 붕괴하는 별, 4개 이상이면 도태로 다음 별을 엽니다. 포식자의 이빨을 골랐다면 진입 직전과 탈태 초반에 공허칼날을 맞힙니다. 탈태를 최대한 길게 끌어 별을 많이 쓰는 것이 목표입니다.' },
  { label: '궤멸자 쐐기 광역', text: '박멸을 들고 탈태에 들어가 박멸·공허 광선·붕괴하는 별을 잇고, 공허내림 발동에 맞춰 도태를 씁니다. 영혼이 40개를 넘게 될 것 같으면 별을 먼저 씁니다. 공허상흔처럼 일부러 탈태를 끝내지 않습니다.' },
  { label: '공허상흔 대안', text: '근접 강화 기술(사신의 대가·장막 관통·포식자의 각성)을 붕괴하는 별보다 먼저 쓰고, 별이 초기화한 사냥을 다시 씁니다. 10월 13일 이후 공개 가이드는 흐트러지기 쉬워 추천하지 않으니 근접이 안전한 전투에서만 고릅니다.' },
  { label: '로그 확인', text: '탈태마다 붕괴하는 별 횟수, 진입까지 걸린 시간, 광역 박멸 사용 위치와 종료 후 공격 중단 시간을 확인합니다. 비교 로그의 영웅 특성·세트 조건과 10월 13일 전후를 먼저 맞추세요.' },
];

g.sourceNote = g.sourceNote + ' 영웅 특성 기준은 Wowhead 특성 안내(2026-10-13 수정)와 Icy Veins(2026-10-12 갱신, 12.1.5 표기)가 모두 궤멸자를 거의 모든 콘텐츠에 추천해 궤멸자로 바꿨습니다(특성 견본도 Wowhead 12.1.5 궤멸자 견본으로 교체 중). 궤멸자 순서는 Wowhead 운용 가이드(2026-10-14)의 단일·광역 우선순위와 표본 오프닝을 기준으로, SimulationCraft 기본 우선순위(탈태 밖 포식자의 이빨이면 진입 직전 공허칼날, 탈태 안 공허 광선 뒤 붕괴하는 별)와 대조했습니다.';

// caveats: 1차에서 넣은 공허상흔 기준 문장을 궤멸자 기준으로 교체
g.caveats = g.caveats.map(c => c.startsWith('공허상흔 단일 순서는 10월 13일 이후')
  ? '이 가이드는 10월 13일 이후 Wowhead·Icy Veins 추천에 맞춰 궤멸자를 기준으로, 공허상흔을 대안으로 다룹니다. 작성자 추천이며 사용률 통계나 같은 조건 성능 비교가 아닙니다.'
  : c.startsWith('공허상흔 광역에서 두 번째 공허 광선 뒤')
    ? '공허상흔 광역에서 두 번째 공허 광선 뒤 일부러 종료를 준비하는 규칙은 10월 13일 변경으로 다시 확인 중입니다. 궤멸자는 이 규칙을 쓰지 않습니다.'
    : c);
g.caveats = g.caveats.map(c => c.startsWith('단일 우선순위와 광역 박멸 회전은 서로 다릅니다') ? c : c);

// evidence: 궤멸자 근거 추가(개념서형 개편 문장은 마지막 유지)
const evNote = g.evidence.find(e => e.startsWith('개념서형 개편'));
const ev = g.evidence.filter(e => !e.startsWith('개념서형 개편'));
ev.push('Wowhead 포식 운용 가이드(2026-10-14 수정) 궤멸자: 단일 탈태 안은 영혼분출 발동 집어삼키기 → 공허 광선(영혼이 넘치지 않으면) → 붕괴하는 별 → 도태(4개 이상) → 공허칼날(포식자의 이빨 선택 시) → 집어삼키기, 탈태가 끝날 때 영혼 제물입니다. 광역은 영혼 40개를 넘기 전 별 → 발동 집어삼키기 → 박멸(파편 10개 또는 공허내림 발동) → 공허 광선 → 별 → 도태 → 집어삼키기입니다. 탈태마다 별 목표는 단일 4~5회, 광역 5회 이상입니다.');
ev.push('SimulationCraft 기본 포식 우선순위(2026-10-13) 궤멸자: 탈태 밖에서 포식자의 이빨을 골랐다면 영혼이 다 찼을 때 공허칼날 → 탈태, 탈태 안에서는 공허 광선 쿨다운이 돌고 있을 때 붕괴하는 별을 쓰고 4개 이상 도태로 다음 별을 엽니다.');
if (evNote) ev.push(evNote);
g.evidence = ev;

// tips: 궤멸자 팁 추가
g.tips = [...g.tips, '궤멸자 광역에서 탈태 중 모은 영혼이 40개를 넘게 될 것 같으면 박멸이나 광선보다 붕괴하는 별을 먼저 쓰세요(Wowhead 광역 우선순위).'];

// heroConclusion 문장 보정(적용 전 기록 표시는 1차에서 붙음)
g.logReview.heroConclusion.conclusion = g.logReview.heroConclusion.conclusion.replace('변경 뒤 Wowhead·Icy Veins는 궤멸자를 거의 모든 콘텐츠에 추천합니다.', '변경 뒤 Wowhead·Icy Veins는 궤멸자를 거의 모든 콘텐츠에 추천해 이 가이드도 궤멸자를 기준으로 바꿨습니다.');

const after = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };
for (const k of Object.keys(before)) if (before[k] !== after[k]) throw new Error('바뀌면 안 되는 필드가 바뀜: ' + k);
const builders = g.opener.steps.filter(s => ['1245412', '1246167'].includes(s.skillId)).length;
if (builders !== 1) throw new Error('맨 위 opener 진입 직전 발동 기술 수가 1이 아님: ' + builders);
if (!g.heroBranches[1].bullets.some(b => b.includes('포식자의 이빨'))) throw new Error('궤멸자 bullets 에 포식자의 이빨 없음');
if (!g.heroBranches[0].skillIds.includes('1239123')) throw new Error('공허상흔 skillIds 1239123 없음');
fs.writeFileSync(FILE, JSON.stringify(g, null, 2) + '\n');
console.log('ok; opener', g.opener.steps.map(s => s.skillId).join('>'));
