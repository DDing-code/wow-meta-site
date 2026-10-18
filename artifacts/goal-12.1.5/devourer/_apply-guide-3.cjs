// 3차: 문구 규칙(표본→예시, 재사용 대기시간→쿨다운), Wowhead 주소 /ko/guide/ 통일, 공허상흔 분기 역할 용어 보강
const fs = require('fs');
const FILE = 'C:/wowmeta/kb/08-직업별-Knowledge-Base/02-악마사냥꾼/포식/Meta/guide-12.1.json';
const g = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const before = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };

// 영문 Wowhead 항목을 기존 /ko/guide/ 항목에 합친다
const EN_ROT = 'https://www.wowhead.com/guide/classes/demon-hunter/devourer/rotation-cooldowns-pve-dps';
const EN_TAL = 'https://www.wowhead.com/guide/classes/demon-hunter/devourer/talent-builds-pve-dps';
const KO_ROT = 'https://www.wowhead.com/ko/guide/classes/demon-hunter/devourer/rotation-cooldowns-pve-dps';
const KO_TAL = 'https://www.wowhead.com/ko/guide/classes/demon-hunter/devourer/talent-builds-pve-dps';
g.sources = g.sources.filter(s => s.url !== EN_ROT && s.url !== EN_TAL);
const koRot = g.sources.find(s => s.url === KO_ROT);
koRot.label = 'Wowhead 포식 운용 가이드 - VooDooSaurus (12.1.5판)';
koRot.updated = 'dateModified 2026-10-14 / 2026-10-18 확인 (이전 확인 2026-09-02 판)';
koRot.note = '궤멸자·공허상흔 단일·광역 우선순위와 예시 오프닝. 궤멸자: 공허 광선 → 붕괴하는 별 → 도태, 포식자의 이빨이면 공허칼날. 공허상흔: 별 전에 사냥·공허칼날을 쓰고 별 뒤 초기화된 포식자의 각성을 다시 씀. 영문 본문을 확인하고 한국어 명칭은 공식 툴팁과 대조.';
const koTal = g.sources.find(s => s.url === KO_TAL);
koTal.label = 'Wowhead 포식 특성 빌드 (12.1.5판)';
koTal.updated = 'dateModified 2026-10-13 / 2026-10-18 확인 (이전 확인 2026-08-17 판)';
koTal.note = '12.1.5 변경과 붕괴하는 별 상향 뒤 궤멸자를 구렁을 뺀 거의 모든 상황에 추천하고 공허상흔은 흐트러지기 쉬워 비추천. 작성자 추천이며 사용률 통계가 아닙니다.';

// 금지어 치환(문자열 전체)
function walk(v) {
  if (typeof v === 'string') return v.replace(/예시 타임라인|표본 타임라인/g, '예시 타임라인').replace(/표본/g, '예시');
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') { for (const k of Object.keys(v)) if (!['blocks', 'book', 'talentBuilds', 'logReview'].includes(k)) v[k] = walk(v[k]); return v; }
  return v;
}
for (const k of ['summary', 'sourceStatus', 'sourceNote', 'playstyle', 'sources', 'evidence', 'caveats', 'heroBranches', 'tips', 'priority', 'opener']) g[k] = walk(g[k]);
const voidrush = g.sources.find(s => s.url === 'https://nether.wowhead.com/tooltip/spell/1272422?locale=1');
voidrush.note = '붕괴하는 별이 공허칼날의 쿨다운을 10초 감소. 공허 탈태 중 공허칼날과 사냥이 일시적으로 격노 소모량을 감소. KB 노트는 아직 없습니다.';

// 공허상흔 분기 역할 용어(피해·자원) 보강
const vs = g.heroBranches[0];
vs.bullets[2] = '실수 방지: 포식자의 각성이 남은 채로 붕괴하는 별을 쓰면 사냥 초기화를 버려 탈태 한 번의 피해가 줄어듭니다. 별은 끊어도 5초 쿨다운이 없으니 피할 패턴이 오면 끊고 다시 시전하되, 격노 소모 감소는 시전 1.5회분까지만 이어집니다.';

const after = { patch: g.patch, status: g.status, talentBuilds: JSON.stringify(g.talentBuilds), blocks: JSON.stringify(g.blocks), book: JSON.stringify(g.book), keys: Object.keys(g).join() };
for (const k of Object.keys(before)) if (before[k] !== after[k]) throw new Error('바뀌면 안 되는 필드가 바뀜: ' + k);
const txt = JSON.stringify(g);
console.log('표본 남음', (txt.match(/표본/g) || []).length, '| 영문 wowhead guide', g.sources.filter(s => /wowhead\.com\/guide\//.test(s.url)).length);
fs.writeFileSync(FILE, JSON.stringify(g, null, 2) + '\n');
