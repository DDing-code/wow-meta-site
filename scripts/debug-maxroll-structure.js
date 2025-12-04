/**
 * Maxroll 페이지 구조 디버깅 스크립트
 *
 * 실제 Maxroll 페이지의 HTML 구조를 분석하여
 * 왜 데이터 추출이 실패하는지 확인합니다.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function debugMaxrollStructure(url) {
  console.log('🔍 Maxroll 페이지 구조 분석 시작:', url);

  const browser = await chromium.launch({ headless: false }); // 브라우저 표시
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 페이지 로드 완료');

    await page.waitForTimeout(5000); // 5초 대기

    // 페이지 구조 분석
    const structure = await page.evaluate(() => {
      const result = {
        h1: [],
        h2: [],
        h3: [],
        sections: [],
        articles: [],
        divWithId: [],
        allText: ''
      };

      // h1 태그
      document.querySelectorAll('h1').forEach(h1 => {
        result.h1.push(h1.textContent.trim());
      });

      // h2 태그
      document.querySelectorAll('h2').forEach(h2 => {
        result.h2.push(h2.textContent.trim());
      });

      // h3 태그
      document.querySelectorAll('h3').forEach(h3 => {
        result.h3.push(h3.textContent.trim());
      });

      // section 태그
      document.querySelectorAll('section').forEach(section => {
        result.sections.push({
          id: section.id,
          class: section.className,
          text: section.textContent.substring(0, 100)
        });
      });

      // article 태그
      document.querySelectorAll('article').forEach(article => {
        result.articles.push({
          id: article.id,
          class: article.className,
          text: article.textContent.substring(0, 100)
        });
      });

      // id 속성이 있는 div
      document.querySelectorAll('div[id]').forEach(div => {
        result.divWithId.push({
          id: div.id,
          class: div.className,
          text: div.textContent.substring(0, 100)
        });
      });

      // 전체 텍스트 (처음 2000자)
      result.allText = document.body.textContent.substring(0, 2000);

      return result;
    });

    console.log('\n📊 페이지 구조 분석 결과:\n');
    console.log('=== H1 태그 ===');
    structure.h1.forEach((text, i) => console.log(`${i + 1}. ${text}`));

    console.log('\n=== H2 태그 ===');
    structure.h2.forEach((text, i) => console.log(`${i + 1}. ${text}`));

    console.log('\n=== H3 태그 ===');
    structure.h3.slice(0, 20).forEach((text, i) => console.log(`${i + 1}. ${text}`));

    console.log('\n=== Section 태그 ===');
    structure.sections.slice(0, 10).forEach((section, i) => {
      console.log(`${i + 1}. ID: ${section.id}, Class: ${section.class}`);
      console.log(`   Text: ${section.text.substring(0, 50)}...`);
    });

    console.log('\n=== 전체 텍스트 미리보기 ===');
    console.log(structure.allText);

    // 결과를 파일로 저장
    const outputPath = 'temp/maxroll-structure-debug.json';
    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2), 'utf8');
    console.log(`\n💾 전체 결과 저장: ${outputPath}`);

    // 10초 대기 후 종료 (수동 확인 가능)
    console.log('\n⏳ 10초 후 브라우저 종료...');
    await page.waitForTimeout(10000);

    await browser.close();

  } catch (error) {
    await browser.close();
    console.error('❌ 분석 실패:', error.message);
    throw error;
  }
}

// 실행
const url = process.argv[2] || 'https://maxroll.gg/wow/class-guides/arcane-mage-mythic-plus-guide';
debugMaxrollStructure(url);
