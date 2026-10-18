// 개념서 리빌딩 미리보기 검사: 실제 파일을 바꾸지 않고 새 원고로 원고 검사기를 돌린다.
// 사용: node artifacts/book-rebuild/preview.cjs <가이드 ID> [<가이드 ID> ...]
// 결과 원고는 artifacts/book-rebuild/<ID>/preview.json 에 남는다(화면 확인 전 내용 검토용).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { SITE, MANUSCRIPT_DIR, manuscriptFile, kbGuidePath, buildNext, loadContent, replaceManuscript } = require('./lib.cjs');

const ids = process.argv.slice(2);
if (!ids.length) { console.error('가이드 ID를 주세요'); process.exit(2); }
const previews = ids.map(id => {
  const { file } = kbGuidePath(id);
  const original = JSON.parse(fs.readFileSync(file, 'utf8'));
  const json = buildNext(original, loadContent(id));
  fs.writeFileSync(path.join(__dirname, id, 'preview.json'), JSON.stringify(json, null, 2) + '\n');
  return { id, kbFile: file, json };
});
const tmp = path.join(__dirname, `.preview-${process.pid}.json`);
fs.writeFileSync(tmp, JSON.stringify(previews));
const run = spawnSync(process.execPath, [path.join(SITE, 'scripts', 'validate-guide-manuscripts.js')], {
  cwd: SITE, env: { ...process.env, GUIDE_BOOK_PREVIEW: tmp }, encoding: 'utf8',
});
fs.unlinkSync(tmp);
const out = `${run.stdout}${run.stderr}`;
const lines = out.split('\n').filter(line => line.startsWith('  - '));
const mine = lines.filter(line => ids.some(id => line.includes(id)));
const others = lines.filter(line => !mine.includes(line));
for (const p of previews) {
  const b = p.json.blocks;
  console.log(`${p.id}: 장 ${b.length} · 부 ${p.json.book.parts.length} · 흐름도 ${b.filter(x => x.diagram).length} · 타임라인 ${b.filter(x => x.timeline).length} · 확인 문제 ${b.reduce((n, x) => n + (x.quiz || []).length, 0)}`);
}
if (mine.length) { console.log(`\n이 가이드 관련 오류 ${mine.length}개:`); mine.forEach(line => console.log(line)); }
if (others.length) { console.log(`\n다른 가이드·전체 규칙 오류 ${others.length}개(직접 관련 없을 수 있음):`); others.slice(0, 20).forEach(line => console.log(line)); }
// 문구 검사(번역투·금지 용어): 전문화별 원고 파일을 임시 폴더에 복사하고, 이 가이드 파일만 새 원고로 바꿔서 돌린다.
const tmpDir = path.join(__dirname, `.preview-${process.pid}`);
// (fs.cpSync 는 이 PC의 Node 22 에서 한글이 든 경로를 만나면 프로세스가 죽는다. 파일을 하나씩 복사한다.)
fs.mkdirSync(tmpDir);
const tmpNames = fs.readdirSync(MANUSCRIPT_DIR).filter(name => name.endsWith('.js'));
tmpNames.forEach(name => fs.copyFileSync(path.join(MANUSCRIPT_DIR, name), path.join(tmpDir, name)));
previews.forEach(item => {
  const target = path.join(tmpDir, path.basename(manuscriptFile(item.id)));
  fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), item.id, item.json));
});
const copy = spawnSync(process.execPath, [path.join(SITE, 'scripts', 'validate-guide-copy.js')], {
  cwd: SITE, env: { ...process.env, GUIDE_COPY_MANUSCRIPT_DIR: tmpDir }, encoding: 'utf8',
});
const copyOut = `${copy.stdout}${copy.stderr}`;
const copyLines = copyOut.split('\n').filter(line => line.startsWith('  - '))
  .map(line => {
    // 오류 줄은 "  - <사이트 기준 파일 경로>:<줄 번호>: …" 모양이다. 그 파일의 그 줄을 같이 보여 준다.
    const hit = line.match(/^ {2}- (.+?):(\d+):/);
    const file = hit ? path.resolve(SITE, hit[1]) : '';
    const text = hit && fs.existsSync(file) ? (fs.readFileSync(file, 'utf8').split('\n')[Number(hit[2]) - 1] || '').trim().slice(0, 160) : '';
    return `${line}\n      ↳ ${text}`;
  });
tmpNames.forEach(name => fs.unlinkSync(path.join(tmpDir, name)));
fs.rmdirSync(tmpDir);
if (copy.status && !copyLines.length) { console.log(`\n문구 검사가 돌지 못함:\n${copyOut.slice(0, 4000)}`); process.exit(1); }
if (copyLines.length) { console.log(`\n문구 검사 오류 ${copyLines.length}개(이 가이드 문장이면 고칠 것):`); copyLines.forEach(line => console.log(line)); }
if (!run.status && !copyLines.length) console.log('\n원고·문구 검사 통과');
else if (run.status && !lines.length) console.log(out.slice(0, 4000));
process.exit(mine.length || copyLines.length ? 1 : 0);
