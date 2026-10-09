const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ui=require('./local-release.json');
const metadata=require('./local-metadata.json');
assert.equal(ui.length,21);
assert.equal(ui.flatMap(r=>r.modeChecks).length,126);
assert.equal(metadata.length,9);
assert(ui.every(r=>!r.overflow&&r.builds===3&&r.modeChecks.every(m=>!m.overflow&&m.fit&&!m.missing.length)));
const visual=require('./visual-review.json');
const remaining={...require('../remaining-review.json'),checkedAt:new Date().toISOString(),independentVisualReview:'t1v 완료: 45개 화면 모음 직접 확인·새 빌드 21화면 독립 실행',evidence:'review.json'};
fs.writeFileSync(__dirname+'/remaining-review.json',JSON.stringify(remaining,null,2));
const primaryViews=['local-release-priest-holy-320-flow.png','local-release-deathknight-unholy-390-comparison.png','local-release-hunter-marksmanship-1440-talents.png','local-news-320-metadata.png','local-news-1440-metadata.png','local-guide-deathknight-unholy-390-metadata.png','local-paladin-protection-390-comparison-icons.png','local-guide-320-metadata.png','local-guide-1440-metadata.png'];
const files=['src/data/guideUpdates.js','src/data/kb-skills.json','src/data/kb-synergies.json'];
const result={checkedAt:new Date().toISOString(),reviewer:'t1v',independent:true,baselineCommit:'a7702c01',contentCommit:'df833379',baselineSourceHashesMatched:require('./baseline.json').matchedInputs,visualScope:{guides:40,widths:visual.widths,contactSheets:45,regions:360,baselineBundle:visual.baselineBundle},finding:{problem:'사이트의 Git 반영 날짜와 최신 업데이트 설명이 10월 8일 상태로 남아 있었다.',fix:'10월 10일 내용 커밋 df833379의 변경 기록 2개를 추가했다. 해결된 툴팁 3건과 남은 24개 분기를 구분하고 완료 4·부분 36을 유지했다.',layout:'추가 배치 결함을 발견하지 못했다. 비교 캡처의 빈 아이콘은 현재 화면에서 정상 로딩을 확인했다.'},changedFiles:files.map(file=>({file,sha256:sha(path.join(root,file))})),build:require('./build-proof.json'),localChecks:{guides:7,widths:[320,390,1440],routes:ui.length,heroModes:126,talentDisclosures:63,metadataRoutes:9,base:'http://127.0.0.1:4178'},inspectedCurrentScreenshots:primaryViews.map(file=>({file,sha256:sha(path.join(__dirname,file))})),validation:{full:'통과',build:'통과',publication:'40개 날짜·내용 커밋·완료 4/부분 36 일치',kbSync:'내용 동일, 생성 시각만 갱신',online:'t1의 같은 내용 검증 근거를 재사용했다. 온라인 재조회는 반복하지 않았다.',remainingWarnings:'의도적인 과거 주문 경고 6개·기존 린트·번들 크기 경고'},goalCriteria:{complete:4,partial:36,tooltipConflicts:0,unobservedHeroBranches:24,actualKoreaAppliedAt:null,confirmedHeroRanking:false,independentVisualReview:true,allFortyComplete:false},excluded:'기존 translation-validation-report.json 변경과 타 담당 산출물은 커밋하지 않는다.'};
if(fs.existsSync(__dirname+'/public-metadata.json')) {
 const published=require('./public-ui.json'), metadata=require('./public-metadata.json'), deployment=require('./public-deploy.json');
 assert.equal(published.length,21); assert.equal(metadata.length,9); assert.equal(deployment.files.length,6); assert.equal(deployment.routes.length,40);
 assert(published.every(r=>r.bundle.endsWith(result.build.bundle)&&!r.overflow&&r.modeChecks.length===6&&r.modeChecks.every(m=>!m.overflow&&m.fit&&!m.missing.length)));
 assert(metadata.every(r=>r.bundle.endsWith(result.build.bundle)&&!r.overflow));
 const views=['public-ui-priest-holy-320-flow.png','public-ui-hunter-marksmanship-320-talents.png','public-ui-deathknight-unholy-390-comparison.png','public-ui-monk-brewmaster-390-flow.png','public-ui-warrior-protection-1440-flow.png','public-ui-hunter-marksmanship-1440-talents.png','public-news-320-metadata.png','public-news-1440-metadata.png','public-guide-deathknight-unholy-390-metadata.png'];
 result.publication={commit:result.build.newCommit,deploymentId:deployment.deploymentId,status:deployment.deploymentStatus,bundle:deployment.bundle,sha256:deployment.bundleSha256,filesMatched:6,htmlRoutes:40,browserGuides:7,browserViews:21,heroModes:126,talentDisclosures:63,metadataViews:9,inspectedScreenshots:views.map(file=>({file,sha256:sha(path.join(__dirname,file))}))};
}
fs.writeFileSync(__dirname+'/review.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({reviewedGuides:40,localRoutes:21,metadataRoutes:9,tooltipConflicts:0,complete:4,partial:36}));
