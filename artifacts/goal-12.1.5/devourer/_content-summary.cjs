// content.cjs 의 summary·evidenceNote·머리 주석·중복 실수 문구 보정
const fs = require('fs');
const F = 'C:/wowmeta/site/artifacts/book-rebuild/demonhunter-devourer/content.cjs';
let s = fs.readFileSync(F, 'utf8');
const g = JSON.parse(fs.readFileSync('C:/wowmeta/kb/08-직업별-Knowledge-Base/02-악마사냥꾼/포식/Meta/guide-12.1.json', 'utf8'));
function rep(a, b) { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) >= 0) throw new Error('rep 실패: ' + a.slice(0, 50)); s = s.slice(0, i) + b + s.slice(i + a.length); }
function lineRep(prefix, value) {
  const i = s.indexOf('\n' + prefix);
  if (i < 0) throw new Error('줄 못 찾음: ' + prefix);
  const j = s.indexOf('\n', i + 1);
  s = s.slice(0, i) + '\n' + prefix + "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'," + s.slice(j);
}
rep("      '공허상흔 광역 영상을 보고 두 번째 광선 뒤 탈태를 끝내 별을 쓸 시간을 버립니다.',\n      '진입 직전에 박멸을 써 버려", "      '공허상흔 광역 영상을 보고 궤멸자에서도 두 번째 광선 뒤 손을 놓아 별을 쓸 시간을 버립니다.',\n      '진입 직전에 박멸을 써 버려");
lineRep('  summary: ', g.summary);
lineRep('  evidenceNote: ', '개념서형 개편(2026-10-18): 기존 검수 본문과 KB 공식 툴팁을 처음 하는 사람이 읽는 순서(준비 → 원리 → 연습 → 실전 → 심화)로 다시 엮었습니다. 같은 날 12.1.5(10월 13일 미국 적용) 반영으로 영웅 특성 기준을 궤멸자로 바꾸고(3부 궤멸자·4부 공허상흔), 두 분기의 우선순위·오프닝을 변경 뒤 갱신된 Wowhead(10월 13·14일)·SimulationCraft(10월 13일) 순서로 고쳤습니다. 현장의 목소리는 아직 모으지 않았습니다.');
rep('// 우선순위·오프닝·영웅 특성 결론은 guide-12.1.json의 priority·opener·heroBranches를 그대로 따른다.', '// 우선순위·오프닝·영웅 특성 결론은 guide-12.1.json의 priority·opener·heroBranches를 그대로 따른다(2026-10-18 12.1.5 반영: 궤멸자 기준).');
fs.writeFileSync(F, s);
delete require.cache[require.resolve(F)];
const c = require(F);
console.log('summary 일치', c.summary === g.summary, '| evidenceNote', c.evidenceNote.slice(0, 30));
