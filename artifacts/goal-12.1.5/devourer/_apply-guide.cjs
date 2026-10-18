// 포식 정본(guide-12.1.json) 12.1.5 반영: blocks·book·patch·status·talentBuilds 는 건드리지 않는다.
const fs = require('fs');
const FILE = 'C:/wowmeta/kb/08-직업별-Knowledge-Base/02-악마사냥꾼/포식/Meta/guide-12.1.json';
const g = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const before = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };

const SIMC = 'SimulationCraft 기본 우선순위(10월 13일)';
const WH = 'Wowhead 운용 가이드(10월 14일)';

// ── 공허상흔 단일 오프닝 (Wowhead 10월 14일 표본 타임라인 · Icy Veins 12.1.5 오프닝) ──
// 검사기: 맨 위 opener 에는 진입 직전 발동용 공허칼날·사냥 중 하나만 둔다 → 사냥은 공허칼날 단계 메모로 넣는다.
const opener = {
  title: '공허상흔 단일 첫 진입 전투 흐름',
  summary: '단일 네임드 기준의 첫 진입입니다. 10월 13일 변경 뒤 갱신된 Wowhead 표본 타임라인(10월 14일)과 Icy Veins 오프닝(12.1.5 표기)에서 공통 순서를 가져왔습니다. 발동에 따라 중간 생성기 횟수는 달라집니다. 광역 박멸 빌드는 본문의 진입·종료·재준비 흐름을 따르며, 이 단일 순서를 그대로 반복하지 않습니다.',
  steps: [
    { skillId: '1241937', label: '영혼 제물', phase: '전투 전', trigger: '풀링 약 2초 전', note: '격노 30과 파편 3개가 5초에 걸쳐 들어옵니다. 격렬한 변신이 탈태 진입 때 쿨다운을 초기화하므로 첫 진입 전에 아끼지 않습니다.' },
    { skillId: '473662', label: '흡수', phase: '첫 생성', trigger: '풀링 약 1초 전', note: '전투 시작에 맞춰 생성합니다. 이후 빈 시간에도 파편과 격노를 만듭니다.' },
    { skillId: '1226019', label: '수확', phase: '파편 회수', trigger: '4개 이상 회수 가능', note: '흡수와 번갈아 첫 탈태 조건을 만듭니다. 영혼분출 발동 흡수가 있으면 먼저 씁니다.' },
    { skillId: '473728', label: '공허 광선', phase: '준비 진행', trigger: '격노 100', note: '안전하게 끝까지 쓸 위치에서 사용합니다. 광선이 만든 파편을 다시 수확으로 거둡니다.' },
    { skillId: '1245412', label: '공허칼날', phase: '진입 직전', trigger: '영혼이 거의 찼을 때', note: '굶주린 베기 발동(6초)을 만듭니다. 사냥이 준비됐다면 이어서 사냥으로 돌진하고 돌진하는 동안 탈태를 누릅니다(Wowhead 10월 14일, 복수의 퇴각으로 거리를 벌리는 것은 선택). 격렬한 변신이 진입 때 공허칼날을 초기화합니다.' },
    { skillId: '471306', label: '공허 탈태', phase: '탈태 진입', trigger: '요구 영혼 충족', note: '기본 50개, 영혼 탐식 선택 시 35개입니다. 진입 시 격노가 채워지고 격렬한 변신으로 공허칼날·영혼 제물 쿨다운이 초기화됩니다.' },
    { skillId: '473728', label: '공허 광선', phase: '탈태 첫 광선', trigger: '진입 직후', note: '탈태 안 광선은 격노를 쓰지 않고 격노 소모를 멈춥니다. 들어가자마자 씁니다.' },
    { skillId: '1245470', label: '사신의 대가', phase: '근접 강화', trigger: '들고 온 발동', note: '진입 직전 띄운 굶주린 베기의 강화형입니다. 발동 만료 전에 실제 대상에게 씁니다.' },
    { skillId: '1245483', label: '장막 관통', phase: '근접 강화', trigger: '붕괴하는 별 전', note: '공허칼날의 강화형입니다. 별을 쓰기 전에 써 둡니다.' },
    { skillId: '1221167', label: '붕괴하는 별', phase: '별 시전', trigger: '탈태 중 영혼 30개', note: '악마의 격화를 찍었다면 사냥 쿨다운이 초기화됩니다. 피할 패턴이 오면 끊어도 5초 쿨다운이 걸리지 않습니다.' },
    { skillId: '1259431', label: '포식자의 각성', phase: '근접 강화', trigger: '별이 사냥을 초기화한 뒤', note: '돌아온 사냥의 강화형입니다. 대상과 경로를 확인합니다. Wowhead 표본은 진입 직전 사냥을 돌진 중 탈태로 강화형으로 바꾸고, 별 뒤에 한 번 더 씁니다.' },
    { skillId: '1245453', label: '도태', phase: '내부 회수', trigger: '4개 이상 또는 최대 충전', note: '다음 별에 쓸 파편을 거둡니다. 영혼분출 발동 집어삼키기를 함께 확인합니다.' },
    { skillId: '473728', label: '공허 광선', phase: '단일 유지', trigger: '쿨이 돌면', note: '도태와 집어삼키기로 이어 가며 다음 별을 준비합니다. 단일은 두 번째 광선 뒤 일부러 멈추지 않습니다.' },
  ],
};

// ── 공허상흔 단일·탈태 안 우선순위 (SimC 10/13 · Wowhead 10/14 · Icy Veins 공통) ──
const vsSingle = [
  { skillId: '1217610', label: '발동 집어삼키기', note: '영혼분출을 발동시킬 때 먼저 씁니다(Wowhead·Icy Veins 맨 위). 시즌 2 세트 효과가 있을 때만 해당합니다.' },
  { skillId: '473728', label: '공허 광선', note: '탈태 안에서는 쿨이 돌 때마다 씁니다. 격노를 쓰지 않고 격노 소모를 멈추며, 공허정화를 골랐다면 쿨다운이 2.5초 짧습니다.' },
  { skillId: '1245470', label: '사신의 대가', note: '들고 온 굶주린 베기 발동의 강화형입니다. 만료 전에 실제 대상에게 맞힙니다.' },
  { skillId: '1245483', label: '장막 관통', note: '붕괴하는 별 전에 씁니다. 안전한 경로와 대상 위치를 확인합니다.' },
  { skillId: '1259431', label: '포식자의 각성', note: '붕괴하는 별이 사냥 쿨다운을 초기화하므로(악마의 격화) 별보다 먼저 씁니다.' },
  { skillId: '1221167', label: '붕괴하는 별', note: '탈태 중 영혼 30개를 흡수하면 씁니다. 시전을 끊어도 5초 쿨다운이 없지만 격노 소모 감소는 시전 1.5회분까지입니다.' },
  { skillId: '1245453', label: '도태', note: '4개 이상 영혼 파편을 회수하거나 최대 충전일 때 씁니다. 다음 별에 쓸 파편을 모읍니다.' },
  { skillId: '1217610', label: '집어삼키기', note: '빈 시간을 채우고 격노 16으로 탈태를 늘립니다. 광역 종료 준비와는 다릅니다.' },
  { skillId: '1241937', label: '영혼 제물', note: '탈태가 끝날 무렵 씁니다(Wowhead·Icy Veins). 격렬한 변신이 다음 진입 때 쿨다운을 초기화합니다.' },
];

const vs = g.heroBranches[0];
if (vs.label !== '공허상흔') throw new Error('heroBranches[0] 이 공허상흔이 아님');
if (!vs.skillIds.includes('1221167')) vs.skillIds.splice(vs.skillIds.indexOf('1246167') + 1, 0, '1221167');
vs.summary = '10월 13일(미국) 적용된 변경으로 공허상흔은 붕괴하는 별을 쓰는 흐름이 됐습니다. 악마의 격화를 찍으면 붕괴하는 별이 사냥 쿨다운을 초기화하고, 격렬한 변신은 탈태 진입 때 공허칼날과 영혼 제물을 초기화합니다. 그래서 탈태 안에서는 공허 광선 뒤 근접 강화 기술(사신의 대가·장막 관통·포식자의 각성)을 먼저 쓰고 붕괴하는 별을 이어, 별이 돌려준 포식자의 각성을 다시 씁니다. 이 순서는 10월 13일 이후 갱신된 SimulationCraft 기본 우선순위와 Wowhead 운용 가이드의 공통 순서입니다. 같은 시점의 Wowhead·Icy Veins 특성 안내는 공허상흔이 쉽게 흐트러진다는 이유로 궤멸자를 거의 모든 콘텐츠에 추천하므로, 이 흐름은 공허상흔을 고른 경우의 기준입니다. 한국 검수(레이드 1건·쐐기 0건)는 변경 전 기록이며 상대 분기보다 강하다는 증명이 아닙니다.';
vs.bullets = [
  '오프닝: 탈태 직전 공허칼날로 굶주린 베기 발동을 만들고, 사냥이 준비됐다면 이어서 사냥으로 돌진하는 동안 탈태를 누릅니다(Wowhead 10월 14일). 들어가면 공허 광선 → 사신의 대가 → 장막 관통 → 붕괴하는 별 → 포식자의 각성 순서로 엽니다.',
  '우선순위: 단일·탈태 안은 영혼분출 발동 집어삼키기 → 공허 광선 → 사신의 대가 → 장막 관통 → 포식자의 각성 → 붕괴하는 별 → 4개 이상 도태 → 집어삼키기입니다. 광역은 박멸을 위한 파편과 강화 효과를 남기는 별도 흐름으로 전환합니다.',
  '실수 방지: 포식자의 각성이 남은 채로 붕괴하는 별을 쓰면 사냥 초기화를 버립니다. 별은 끊어도 5초 쿨다운이 없으니 피할 패턴이 오면 끊고 다시 시전하되, 격노 소모 감소는 시전 1.5회분까지만 이어집니다.',
  '로그 확인: 탈태마다 붕괴하는 별 횟수와 그 직전의 포식자의 각성·장막 관통 사용, 근접 강화 기술 적중, 광역 박멸 사용 위치를 따로 봅니다. 10월 13일 전 로그의 별 횟수와 직접 비교하지 않습니다.',
  '선택 기준: 10월 13일 이후 Wowhead·Icy Veins는 궤멸자를 거의 모든 콘텐츠에 추천합니다. 공허상흔은 근접 이동과 긴 시전이 끊기지 않는 전투에서 고르고, 실제 자기 전투의 안전한 근접 시간을 함께 봅니다.',
];
vs.opener = JSON.parse(JSON.stringify(opener));
vs.priority = JSON.parse(JSON.stringify(vsSingle));
vs.singleTarget.summary = `현재 형상 내부 우선순위입니다. 10월 13일 이후 ${SIMC}와 ${WH}의 공통 순서입니다. 형상 외부 생성과 진입 조건은 오프닝·본문을 함께 적용합니다.`;
vs.singleTarget.priority = JSON.parse(JSON.stringify(vsSingle));
vs.aoe.summary = '박멸·근접 연계·영혼 탐식 구성의 광역 주기입니다. Wowhead 광역 우선순위(10월 14일)를 따라 근접 강화 기술 뒤에 붕괴하는 별을 넣었습니다. 두 번째 광선 뒤 일부러 종료를 준비하는 규칙은 변경 뒤 자료끼리 엇갈려(SimulationCraft 10월 13일 기본 우선순위는 그 대기 줄을 뺐고, Wowhead는 박멸·영혼분출 발동을 탈태 밖으로 가져가는 운용을 남김) 10월 13일 변경으로 다시 확인 중입니다. 단일이나 궤멸자 구성에 복사하지 않습니다.';
vs.aoe.priority = [
  { skillId: '1226033', label: '박멸', note: '탈태 진입에 남긴 발동을 실제 전방 대상에 사용합니다. 일반 수확으로 필요한 파편을 먼저 소모하지 않습니다.' },
  { skillId: '473728', label: '공허 광선', note: '첫 내부 광선을 완주해 다음 박멸을 준비합니다.' },
  { skillId: '1245470', label: '사신의 대가', note: '이월한 발동과 후속 근접 강화에서 얻은 발동을 만료 전에 처리합니다.' },
  { skillId: '344866', label: '복수의 퇴각', note: '공허 걸음의 임시 사용 기회가 있고 착지 경로가 안전할 때만 연결합니다.' },
  { skillId: '1245483', label: '장막 관통', note: '붕괴하는 별 전에 대상에게 맞힙니다.' },
  { skillId: '1259431', label: '포식자의 각성', note: '별이 사냥을 초기화하므로 별보다 먼저 씁니다. Wowhead는 광역에서 사냥을 아끼지 말고 쓸 수 있을 때마다 쓰라고 안내합니다.' },
  { skillId: '1221167', label: '붕괴하는 별', note: '근접 강화 기술 뒤에 씁니다. 별이 돌려준 포식자의 각성을 바로 다시 씁니다.' },
  { skillId: '1226033', label: '다음 박멸', note: '준비된 발동·파편을 사용하고 두 번째 공허 광선으로 연결합니다.' },
  { skillId: '473728', label: '두 번째 공허 광선', note: '완주 뒤 종료를 준비할지는 10월 13일 변경으로 다시 확인 중입니다. 변경 전 기준은 격노·파편을 추가 생성해 종료를 늦추지 않는 것이었습니다.' },
  { skillId: '1241937', label: '영혼 제물', note: '탈태 밖에서 씁니다(Wowhead 광역 메모). 격렬한 변신이 다음 진입 때 쿨다운을 초기화합니다. 들끓는 고통 뒤 공격 재개를 준비합니다.' },
];

// 궤멸자: 순서는 이번에 다시 대조하지 않음 — 요약의 영웅 특성 판단 문장만 12.1.5 사실로 바꾼다.
const an = g.heroBranches[1];
if (an.label !== '궤멸자') throw new Error('heroBranches[1] 이 궤멸자가 아님');
an.summary = '붕괴하는 별과 공허내림을 활용하는 원거리 운용입니다. 공허상흔처럼 근접 강화 스킬 세 개를 넣는 것이 목표가 아니며, 공허 탈태 안에서 필요한 파편을 회수하고 붕괴하는 별을 사용할 기회를 확보합니다. 두 빌드는 탈태 종료를 원하는 시점부터 다릅니다. 10월 13일 이후 Wowhead 특성 안내(10월 13일)와 Icy Veins(12.1.5 표기)는 붕괴하는 별 상향과 12.1.5 변경을 이유로 궤멸자를 거의 모든 콘텐츠에 추천합니다. 이 분기의 우선순위 자체는 이번에 새 자료와 다시 대조하지 않았습니다. 한국 검수(레이드 1건·쐐기 1건)는 변경 전 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.';

// 맨 위 우선순위·오프닝 = 공허상흔 단일
g.priority = JSON.parse(JSON.stringify(vsSingle));
g.opener = JSON.parse(JSON.stringify(opener));

g.summary = '포식은 흡수와 수확으로 격노와 영혼 파편을 모아 공허 탈태에 들어가는 지능 전문화입니다. 이 가이드는 준비 → 원리 → 연습 → 실전 → 심화 순서로 읽도록 짰습니다. 스킬 묶음을 먼저 보고, 두 자원과 탈태의 시작·끝, 공허 광선 완주, 근접 연계, 종료 뒤 보상을 익힌 뒤, 허수아비 타임라인과 공허상흔·궤멸자 운용으로 넘어갑니다. 10월 13일(미국) 적용된 변경으로 붕괴하는 별은 두 영웅 특성 모두 탈태 안에서 쓰는 주문이 됐고, 공허상흔은 근접 강화 기술을 먼저 쓴 뒤 별로 사냥을 초기화하는 흐름으로 바뀌었습니다. 단일은 도태로 다음 별에 쓸 파편을 계속 회수하고, 광역은 박멸을 들고 들어간다는 차이가 핵심입니다.';

g.sourceStatus = '2026-10-18 12.1.5(10월 13일 미국 적용) 공식 노트·한국어 툴팁과 변경 뒤 갱신된 SimulationCraft·Wowhead·Icy Veins로 공허상흔 딜사이클을 다시 맞춤. 2026-10-10 한국 레이드 2건·쐐기 1건은 변경 전 기록입니다.';

g.playstyle = [
  { label: '공허상흔 레이드 단일', text: '탈태 안에서 공허 광선을 쿨마다 쓰고, 사신의 대가·장막 관통·포식자의 각성을 붕괴하는 별보다 먼저 맞힙니다. 별이 사냥을 초기화하면 포식자의 각성을 다시 쓰고, 도태로 다음 별에 쓸 파편을 거둡니다. 광역처럼 일부러 딜을 멈춰 탈태를 끝내지 않습니다.' },
  { label: '공허상흔 쐐기 광역', text: '박멸을 준비하고 탈태 진입 → 박멸·공허 광선과 근접 연계 → 붕괴하는 별 → 다음 박멸 순서입니다. 종료 직후 들끓는 고통 구간도 공격을 이어 갑니다. 두 번째 광선 뒤 종료 준비 여부는 10월 13일 변경으로 다시 확인 중입니다.' },
  { label: '로그 확인', text: '탈태마다 붕괴하는 별 횟수와 그 직전 근접 강화 기술 사용, 단일 도태 회수, 광역 탈태 종료 후 공격 중단 시간을 확인합니다. 비교 로그의 영웅 특성·세트 조건과 10월 13일 전후를 먼저 맞추세요.' },
  { label: '궤멸자 대안', text: '공허내림과 붕괴하는 별을 활용하는 원거리 운용입니다. 10월 13일 이후 Wowhead·Icy Veins가 거의 모든 콘텐츠에 추천하는 분기입니다. 공허상흔의 광역 종료 규칙을 가져오지 말고, 탈태를 유지하며 내부 소비 기회를 늘리는 쪽으로 연습합니다.' },
];

g.sourceNote = g.sourceNote + ' 2026-10-18: 12.1.5(10월 13일 미국 적용) 공식 노트로 붕괴하는 별(시전 시작 뒤 사거리 증가, 취소 시 5초 쿨다운 없음, 시전 중 격노 소모 감소는 시전 1.5회분까지), 공허정화 2.5초(기존 2초), 영혼벼림 칼날 18%(기존 15%), 공허상흔 악마의 격화·격렬한 변신·괴물의 각성 변경, 사냥·박멸의 중간 관문 이동을 확인하고 한국어 툴팁(격렬한 변신·악마의 격화·괴물의 각성·공허정화·영혼벼림 칼날·공허돌진)을 다시 읽었습니다. 공허상흔 딜사이클은 변경 뒤 갱신된 SimulationCraft midnight 기본 우선순위(2026-10-13 커밋 a96c612), Wowhead 운용 가이드(2026-10-14 수정)를 결론 근거로, Icy Veins 운용(2026-10-12 갱신, 12.1.5 표기)을 보조 근거로 썼습니다. 세 자료 모두 별을 쓰기 전에 사냥·공허칼날(탈태 안 포식자의 각성·장막 관통)을 먼저 써서 사냥 초기화와 공허돌진의 공허칼날 쿨다운 감소를 살립니다. 위의 9~10월 공개 저자·로그 설명은 변경 전 기록입니다. SimulationCraft 구현 주석은 12.1.5에서도 사냥이 영혼 제물 충전 하나를 돌려준다고 적었지만 공식 노트와 달라 본문에 쓰지 않았습니다.';

// caveats: 기존 문장 유지 + 12.1.5 주의 추가
const cav = g.caveats.slice();
const i0 = cav.findIndex(c => c.startsWith('이 가이드는 12.1 PvE 기준'));
if (i0 >= 0) cav[i0] = '이 가이드는 12.1 PvE 기준이며 10월 13일(미국) 적용된 12.1.5 변경을 반영했습니다. PvP 전용 수치와 효과는 섞지 않았습니다.';
const iStar = cav.findIndex(c => c.startsWith('별의 30영혼 기본 비용'));
if (iStar >= 0) cav[iStar] = '별의 30영혼 기본 비용과 Method 단일 목록의 35영혼 보류 조건은 별개입니다. 10월 13일 변경 뒤 공허상흔도 붕괴하는 별을 쓰므로, 변경 전 공허상흔 근접 견본의 별 미사용을 지금 운용으로 가져오지 않습니다.';
cav.push(
  '공허상흔 단일 순서는 10월 13일 이후 갱신된 SimulationCraft 기본 우선순위와 Wowhead 운용 가이드의 공통 순서입니다. 같은 시점의 Wowhead·Icy Veins 특성 안내는 궤멸자를 거의 모든 콘텐츠에 추천하므로, 이 가이드의 공허상흔 견본은 추천 순위가 아니라 공허상흔을 고른 경우의 기준입니다.',
  '공허상흔 광역에서 두 번째 공허 광선 뒤 일부러 종료를 준비하는 규칙은 10월 13일 변경으로 다시 확인 중입니다. 궤멸자 분기의 우선순위도 이번에 새 자료와 다시 대조하지 않았습니다.',
  '아래 로그 점검(10월 8~10일)과 영웅 특성 결론은 모두 10월 13일 변경 전 기록입니다. 사냥·붕괴하는 별·영혼 제물 관련 결론에 그대로 쓰지 마세요.',
);
g.caveats = cav;

// evidence: 기존 유지, 12.1.5 근거 추가(개념서형 개편 문장은 content.cjs 의 evidenceNote 가 마지막에 붙는다)
const evOld = g.evidence.filter(e => !e.startsWith('개념서형 개편'));
const evNote = g.evidence.find(e => e.startsWith('개념서형 개편'));
evOld.push(
  '12.1.5 공식 노트(10월 13일 미국 적용): 악마의 격화를 찍으면 붕괴하는 별이 사냥 쿨다운을 초기화하고 사냥 강화 효과는 공격력 30%입니다. 격렬한 변신은 영혼 제물 쿨다운을 초기화하고 사냥 초기화·사냥 피해 25% 증가가 빠졌습니다. 괴물의 각성은 지능 10%(기존 15%), 붕괴하는 별 20%(기존 15%)입니다. 2026-10-18 한국어 툴팁도 같은 내용입니다.',
  'SimulationCraft midnight 기본 포식 우선순위(2026-10-13 커밋 a96c612, 프로필 커밋 6feaa8f): 공허상흔 탈태 안에서 별을 쓸 수 있으면 포식자의 각성·장막 관통을 먼저 쓰고 붕괴하는 별을 이어 씁니다. 탈태 밖 단일은 사냥이 준비됐을 때 공허칼날 → 복수의 퇴각 → 사냥 → 탈태로 들어갑니다. 예전에 두 번째 공허 광선 뒤 기다리던 줄은 빠졌습니다.',
  'Wowhead 포식 운용 가이드(2026-10-14 수정): 공허상흔 단일 탈태 안 순서는 영혼분출 발동 집어삼키기 → 공허 광선 → 사신의 대가 → 장막 관통 → 포식자의 각성 → 붕괴하는 별 → 도태(4개 이상·최대 충전) → 집어삼키기, 탈태가 끝날 때 영혼 제물입니다. 별 한 번마다 공허칼날 쿨다운 10초 감소(공허돌진)와 사냥 초기화(악마의 격화)가 있어 둘을 별보다 먼저 씁니다.',
  'Icy Veins 포식 운용(2026-10-12 갱신, 12.1.5 표기)과 Wowhead 특성 안내(2026-10-13 수정)는 12.1.5에서 궤멸자를 거의 모든 콘텐츠에 추천하고, 공허상흔은 잠재력은 높지만 쉽게 흐트러진다고 설명합니다. 사용률 통계가 아니라 작성자 추천입니다.',
);
if (evNote) evOld.push(evNote);
g.evidence = evOld;

// tips: 기존 유지, 첫 줄 보정 + 별 관련 팁 추가
const tips = g.tips.slice();
tips[0] = '레이드 단일에서는 광역 연습의 종료 요령을 가져오지 마세요. 두 번째 공허 광선 뒤에도 도태로 다음 붕괴하는 별에 쓸 파편을 거두고 내부 우선순위를 이어가야 합니다.';
tips.push(
  '공허상흔으로 붕괴하는 별이 열렸다면 포식자의 각성과 장막 관통이 남아 있는지 먼저 보세요. 별이 사냥을 초기화하므로 쿨다운이 돌던 사냥을 쓰지 않고 별을 누르면 초기화를 버립니다.',
  '붕괴하는 별을 피하느라 끊었다면 바로 다시 시전해도 됩니다. 10월 13일부터 취소해도 5초 쿨다운이 없습니다. 다만 끊고 다시 시작해 탈태를 늘리는 방식은 격노 소모 감소가 시전 1.5회분까지라 통하지 않습니다.',
);
g.tips = tips;

// sources: 12.1.5 노트 + 변경 뒤 근거 추가, 낡은 Wowhead·Icy 항목의 updated/note 보정
const src = g.sources;
const add = (s) => { const i = src.findIndex(x => x.url === s.url); if (i >= 0) src[i] = { ...src[i], ...s }; else src.push(s); };
add({ tier: 'S', label: 'Blizzard 12.1.5 콘텐츠 업데이트 노트', url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24304162', updated: '2026-10-02 게시 / 2026-10-13 적용 / 2026-10-18 확인', note: '포식: 붕괴하는 별 사거리·취소·격노 소모 감소 제한, 공허정화 2.5초, 영혼벼림 칼날 18%, 사냥·박멸 중간 관문 이동, 공허상흔 악마의 격화(별이 사냥 초기화·사냥 강화 30%)·격렬한 변신(영혼 제물 초기화)·괴물의 각성(지능 10%·별 20%).' });
const whRot = src.find(s => s.url === 'https://www.wowhead.com/ko/guide/classes/demon-hunter/devourer/rotation-cooldowns-pve-dps');
if (whRot) { whRot.updated = '2026-09-02 / 2026-09-08 확인 (변경 전)'; whRot.note = '변경 전 운용 기준. 10월 13일 이후 판은 아래 영문 2026-10-14 수정본을 씁니다.'; }
const whTal = src.find(s => s.url === 'https://www.wowhead.com/ko/guide/classes/demon-hunter/devourer/talent-builds-pve-dps');
if (whTal) { whTal.updated = '2026-08-17 / 2026-09-08 확인 (변경 전)'; whTal.note = '변경 전 공허상흔 추천. 10월 13일 수정본은 궤멸자를 거의 모든 콘텐츠에 추천합니다(아래 항목).'; }
const ivRot = src.find(s => s.url === 'https://www.icy-veins.com/wow/devourer-demon-hunter-pve-dps-rotation-cooldowns-abilities');
if (ivRot) { ivRot.updated = 'Oct 12, 2026 - 4:30 PM 갱신(12.1.5 표기) / 2026-10-18 확인'; ivRot.note = '12.1.5 표기 판. 공허상흔은 별 시전을 늘려 사냥 초기화와 공허칼날 쿨다운 감소를 살리고, 사냥·공허칼날을 별보다 먼저 씁니다. 미국 적용 하루 전 갱신이라 보조 근거로만 씁니다. 같은 판은 궤멸자를 모든 상황에 추천합니다.'; }
add({ tier: 'B', label: 'SimulationCraft midnight 기본 포식 우선순위(APL)', url: 'https://github.com/simulationcraft/simc/blob/a96c61297e/ActionPriorityLists/default/demonhunter_devourer.simc', updated: '2026-10-13 커밋 a96c612(원본 6feaa8f) / 2026-10-18 확인', note: '12.1.5 적용일에 공허상흔 순서를 새로 씀: 탈태 안에서 별을 쓸 수 있으면 포식자의 각성·장막 관통 먼저, 그다음 붕괴하는 별. 단일 진입은 공허칼날 → 복수의 퇴각 → 사냥 → 탈태. 시뮬레이션 기본값이며 실제 전투 우열의 증거는 아닙니다.' });
add({ tier: 'A', label: 'Wowhead 포식 운용 가이드 12.1.5판 (영문)', url: 'https://www.wowhead.com/guide/classes/demon-hunter/devourer/rotation-cooldowns-pve-dps', updated: 'dateModified 2026-10-14 / 2026-10-18 확인', note: '공허상흔 단일·광역 우선순위와 표본 오프닝. 별 전에 사냥·공허칼날을 쓰고, 별 뒤 초기화된 포식자의 각성을 다시 씀. 한국어 명칭은 공식 툴팁과 대조.' });
add({ tier: 'A', label: 'Wowhead 포식 특성 안내 12.1.5판 (영문)', url: 'https://www.wowhead.com/guide/classes/demon-hunter/devourer/talent-builds-pve-dps', updated: 'dateModified 2026-10-13 / 2026-10-18 확인', note: '12.1.5 변경과 붕괴하는 별 상향 뒤 궤멸자를 구렁을 뺀 거의 모든 상황에 추천. 공허상흔은 잠재력은 높지만 흐트러지기 쉬워 비추천. 작성자 추천이며 사용률 통계가 아닙니다.' });
add({ tier: 'S', label: 'Wowhead 한국어 공허돌진 툴팁', url: 'https://nether.wowhead.com/tooltip/spell/1272422?locale=1', updated: '2026-10-18 직접 확인', note: '붕괴하는 별이 공허칼날의 재사용 대기시간을 10초 감소. 공허 탈태 중 공허칼날과 사냥이 일시적으로 격노 소모량을 감소. KB 노트는 아직 없습니다.' });
add({ tier: 'S', label: 'Wowhead 한국어 영혼벼림 칼날 툴팁', url: 'https://nether.wowhead.com/tooltip/spell/1272432?locale=1', updated: '2026-10-18 직접 확인', note: '굶주린 베기와 공허칼날의 치명타 및 극대화율 18% 증가.' });

// logReview: 수치는 그대로, 설명 문장에 적용 전 주의
const PRE = '10월 13일(미국) 12.1.5 적용 전 기록입니다. ';
if (!g.logReview.scope.startsWith(PRE)) g.logReview.scope = PRE + g.logReview.scope;
if (!g.logReview.currentKorea.scope.startsWith(PRE)) g.logReview.currentKorea.scope = PRE + g.logReview.currentKorea.scope;
if (!g.logReview.heroConclusion.conclusion.startsWith(PRE)) g.logReview.heroConclusion.conclusion = PRE + g.logReview.heroConclusion.conclusion + ' 변경 뒤 Wowhead·Icy Veins는 궤멸자를 거의 모든 콘텐츠에 추천합니다.';

// 금지 필드 그대로인지 확인
const after = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };
for (const k of Object.keys(before)) if (before[k] !== after[k]) throw new Error('바뀌면 안 되는 필드가 바뀜: ' + k);
fs.writeFileSync(FILE, JSON.stringify(g, null, 2) + '\n');
console.log('ok', g.heroBranches[0].opener.steps.length, 'steps; sources', g.sources.length, '; evidence', g.evidence.length, '; caveats', g.caveats.length);
