const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const prior = require('../review-manifest.json');
const inputs = [...prior.ownedFiles, ...prior.kbSourceChanges, ...prior.canonicalGuides, ...prior.rawEvidence];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const input of inputs) assert.equal(sha(input.file), input.sha256, input.file);
fs.writeFileSync(path.join(__dirname, 'baseline.json'), JSON.stringify({checkedAt:new Date().toISOString(), reviewer:'t1v', bundle:prior.build.bundle, matchedInputs:inputs.length, inputs}, null, 2));
const updatesFile = path.join(root, 'src/data/guideUpdates.js');
const source = fs.readFileSync(updatesFile, 'utf8');
assert(!source.includes('"commits":["df833379"]'), '이미 반영된 갱신');
const {guideUpdates} = new Function(source.replace(/export (const|function)/g, '$1') + ';return {guideUpdates}')();
const additions = guideUpdates.slice(0,2).map(entry => ({
  date:'2026-10-10', partial:entry.partial, guideIds:entry.guideIds, commits:['df833379'],
  title:entry.partial ? '12.1 한국 점검 후 전투 근거·공식 툴팁 갱신' : '12.1 기존 검수 가이드의 한국 전투 근거 갱신',
  body:'40개 가이드에 한국 레이드·쐐기 전투 96건과 영웅 특성 80개 분기의 추천·대안을 반영했습니다. 한국어 본 서버 툴팁과 공식 조정을 대조해 수치 차이 3건을 해결했습니다. 한국 점검 예정 종료와 실제 조정 적용 순간을 구분하며, 한국 사례가 없는 24개 영웅 분기와 추천 자료 간 충돌은 계속 검수합니다. 기존 완료 4개·부분 검수 36개 상태는 유지합니다.'
}));
assert.equal(additions.flatMap(e=>e.guideIds).length,40);
assert.equal(additions.filter(e=>!e.partial)[0].guideIds.length,4);
fs.writeFileSync(updatesFile, source.replace('export const guideUpdates = [', 'export const guideUpdates = [\n' + additions.map(e=>'  '+JSON.stringify(e)+',').join('\n')));
// 기존 ODDIN 검사를 이 작업의 탭과 결과 폴더에서 실행한다.
const adapter = fs.readFileSync(path.join(__dirname,'../oddin.cjs'),'utf8').replace("20261010-025144-z2_B/t1'", "20261010-025144-z2_B/t1v'");
assert(adapter.includes("20261010-025144-z2_B/t1v'"));
fs.writeFileSync(path.join(__dirname,'oddin.cjs'),adapter);
let verify = fs.readFileSync(path.join(__dirname,'../verify-ui.cjs'),'utf8');
verify = verify.replace("require('./scope.json')", "require('../scope.json')").replaceAll("require('./manuscripts/", "require('../manuscripts/");
fs.writeFileSync(path.join(__dirname,'verify-ui.cjs'),verify);
console.log(JSON.stringify({matchedInputs:inputs.length, changed:'src/data/guideUpdates.js', guides:40, complete:4, partial:36}));
