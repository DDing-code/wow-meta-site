// 범위 검사(단일 딜사이클 스조라크 빌드 기준, 2026-10-24 2차).
// patches/orig/<ID>.json(이번 작업 전)과 지금 KB 정본을 비교해 범위 밖이 바뀌었는지 본다.
//   범위 안: 2부 단일·오프닝 장(타임라인·글), 영웅 탭 summary·bullets·opener·singleTarget, 1~4부 글 중 단일·오프닝·영웅 특성 선택을 말하는 문장,
//           단일 견본, 레이드 견본 설명, 기본 영웅 탭(decisions.json), 상단 opener(기본 탭 오프닝과 같게), evidence
//   범위 밖: 광역 탭·광역 타임라인·탱사이클, 쐐기 견본, 영상·출처·book·상단 priority, 장 수·부·순서, 현장 팁·인용·출처,
//           장 제목(2부 단일·오프닝 장은 ':' 앞 머리말이 같으면, 3·4부 영웅 특성 장은 같은 영웅 특성 이름이 남으면 허용), 포식 오프닝 첫 두 단계
// 사용: node guard.cjs [가이드 ID ...]
const fs = require('node:fs');
const path = require('node:path');
const {kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const decisions = require('./decisions.json');
const ORIG = path.join(__dirname, 'patches', 'orig');
const EV = '단일 딜사이클 스조라크 빌드 기준';
const FIXED_KEYS = ['video', 'sources', 'priority', 'id'];
const s = v => JSON.stringify(v);
const head = t => String(t || '').split(':')[0];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(ORIG).map(f => f.replace(/\.json$/, ''));
let bad = 0;
for (const id of ids) {
  const a = JSON.parse(fs.readFileSync(path.join(ORIG, id + '.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  const out = [];
  for (const k of FIXED_KEYS) if (s(a[k]) !== s(b[k])) out.push(`최상위 ${k} 바뀜`);
  const changedTop = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => s(a[k]) !== s(b[k]));
  // 상단 summary 는 영웅 특성·견본을 말하는 문장만 고친다(암흑, 통합 단계에서 확인)
  // logReview 는 게시 검수 기록의 choice·evidence 만(본문 선택 조건 문단과 같게) 고칠 수 있다
  const reviewShape = r => (r ? {...r, publicationReview: r.publicationReview ? {...r.publicationReview, choice: '', evidence: ''} : r.publicationReview} : r);
  if (s(reviewShape(a.logReview)) !== s(reviewShape(b.logReview))) out.push('logReview 가 게시 검수 문장 말고도 바뀜');
  // book 은 부 요약(parts[].summary)만 고칠 수 있다(toplevel.cjs)
  const bookShape = book => ({...book, parts: (book?.parts || []).map(p => ({...p, summary: ''}))});
  if (s(bookShape(a.book)) !== s(bookShape(b.book))) out.push('book 이 부 요약 말고도 바뀜');
  for (const k of changedTop) if (!['blocks', 'heroBranches', 'evidence', 'talentBuilds', 'defaultHeroBranchIndex', 'opener', 'summary', 'playstyle', 'caveats', 'tips', 'book', 'logReview', ...FIXED_KEYS].includes(k)) out.push(`최상위 ${k} 바뀜(확인 필요)`);
  if ((b.defaultHeroBranchIndex || 0) !== decisions[id].defaultHeroBranchIndex) out.push('기본 영웅 탭이 decisions.json 과 다름');
  if (s(a.opener) !== s(b.opener) && s(b.opener) !== s(b.heroBranches[b.defaultHeroBranchIndex || 0].opener)) out.push('상단 opener 가 기본 영웅 탭 오프닝이 아님');
  (a.talentBuilds || []).forEach((t, i) => {
    const n = b.talentBuilds[i];
    if (t.id !== n?.id) out.push(`견본 ${i} 순서·이름 바뀜`);
    else if (t.id === 'mythic-plus' && s(t) !== s(n)) out.push('쐐기 견본 바뀜');
    else if (t.id === 'raid' && (t.code !== n.code || s({...t, note: ''}) !== s({...n, note: ''}))) out.push('레이드 견본 코드 바뀜');
  });
  if ((a.heroBranches || []).length !== (b.heroBranches || []).length) out.push('영웅 탭 수 바뀜');
  (a.heroBranches || []).forEach((h, i) => {
    const n = b.heroBranches[i];
    if (h.label !== n?.label) out.push(`영웅 탭 ${i} 이름 바뀜`);
    for (const k of ['aoe', 'tankRaid', 'tankMythic', 'skillIds']) if (s(h[k]) !== s(n?.[k])) out.push(`${h.label}.${k} 바뀜`);
  });
  if ((a.blocks || []).length !== (b.blocks || []).length) out.push('장 수 바뀜');
  (a.blocks || []).forEach((blk, i) => {
    const n = b.blocks[i];
    if (blk.part !== n?.part) out.push(`장 ${i} 부 바뀜`);
    if (blk.title !== n?.title) {
      const tl = [].concat(blk.timeline || []).map(t => t.title).join(' ');
      const singleOrOpener = blk.part === 'drill' && /단일|오프닝/.test(tl);
      const heroChapter = ['field', 'review'].includes(blk.part) && (b.heroBranches || []).some(h => blk.title.includes(h.label) && String(n?.title).includes(h.label));
      if (!(singleOrOpener && head(blk.title) === head(n?.title)) && !heroChapter) out.push(`장 ${i} 제목 바뀜(허용 밖): ${blk.title} → ${n?.title}`);
    }
    const ta = [].concat(blk.timeline || []), tb = [].concat(n?.timeline || []);
    if (ta.length !== tb.length) out.push(`장 ${i} 타임라인 수 바뀜`);
    ta.forEach((t, j) => {
      const isAoe = /광역/.test(t.title) && !/단일|오프닝/.test(t.title);
      if ((isAoe || t.kind === 'tank') && s(t) !== s(tb[j])) out.push(`장 ${i} 광역·탱 타임라인 "${t.title}" 바뀜`);
    });
    for (const k of ['tips', 'quotes', 'sources', 'fieldTips', 'skillGroups']) if (s(blk[k]) !== s(n?.[k])) out.push(`장 ${i} ${k} 바뀜`);
  });
  if (id === 'demonhunter-devourer') {
    for (const h of b.heroBranches) {
      const st = h.opener?.steps || [];
      if (String(st[0]?.skillId) !== '1241937' || String(st[1]?.skillId) !== '473662') out.push(`${h.label} 오프닝 첫 두 단계가 영혼 제물 → 흡수가 아님`);
    }
  }
  const ev = (b.evidence || []).filter(x => x.startsWith(EV));
  if (ev.length !== 1) out.push(`evidence '${EV}' ${ev.length}개`);
  const kept = (a.evidence || []).filter(x => !(b.evidence || []).includes(x));
  if (kept.length) out.push(`예전 evidence ${kept.length}개가 사라짐`);
  if (out.length) bad++;
  console.log(`${id}: ${out.length ? out.join(' / ') : '범위 안'}`);
}
if (bad) process.exitCode = 1;
