import got from 'got';
import * as cheerio from 'cheerio';

console.log('============================================================');
console.log('  Wowhead 페이지 구조 분석');
console.log('============================================================\n');

const testId = 853;  // 심판의 망치

try {
  const response = await got(`https://www.wowhead.com/ko/spell=${testId}`, {
    headers: {
      'user-agent': 'Mozilla/5.0',
      'accept': 'text/html'
    },
    timeout: {
      request: 20000
    }
  });

  const $ = cheerio.load(response.body);

  console.log(`스킬 ID: ${testId}\n`);

  // 1. 모든 테이블 찾기
  console.log('─'.repeat(60));
  console.log('1. 페이지 내 테이블 목록:');
  console.log('─'.repeat(60));

  $('table').each((i, table) => {
    const className = $(table).attr('class') || 'no-class';
    const id = $(table).attr('id') || 'no-id';
    const rowCount = $(table).find('tr').length;

    console.log(`테이블 ${i + 1}:`);
    console.log(`  class: ${className}`);
    console.log(`  id: ${id}`);
    console.log(`  행 수: ${rowCount}`);

    // 테이블 내용 샘플 (첫 3행)
    $(table).find('tr').slice(0, 3).each((j, row) => {
      const cells = $(row).find('th, td').map((k, cell) => $(cell).text().trim()).get();
      console.log(`  행 ${j + 1}: ${cells.join(' | ')}`);
    });

    console.log('');
  });

  // 1-1. #spelldetails 테이블 상세 분석
  console.log('─'.repeat(60));
  console.log('1-1. #spelldetails 테이블 상세 분석:');
  console.log('─'.repeat(60));

  const spelldetails = $('#spelldetails');
  if (spelldetails.length > 0) {
    console.log('✅ #spelldetails 테이블 발견\n');

    // 모든 td 셀 출력
    const allCells = spelldetails.find('td');
    console.log(`총 td 셀 수: ${allCells.length}`);

    allCells.each((i, cell) => {
      const text = $(cell).text().trim();
      console.log(`td[${i}]: "${text}"`);
    });

    // tr 행 구조 출력
    console.log('\n행(tr) 구조:');
    spelldetails.find('tr').each((i, row) => {
      const cellsInRow = $(row).find('td').length;
      console.log(`tr[${i}]: ${cellsInRow}개 td 셀`);
    });
  } else {
    console.log('❌ #spelldetails 테이블 없음');
  }

  // 2. infobox 클래스 테이블 (스킬 정보)
  console.log('─'.repeat(60));
  console.log('2. infobox 테이블 (스킬 세부 정보):');
  console.log('─'.repeat(60));

  const infobox = $('table.infobox');
  if (infobox.length > 0) {
    infobox.find('tr').each((i, row) => {
      const label = $(row).find('th').text().trim();
      const value = $(row).find('td').text().trim();
      if (label && value) {
        console.log(`${label}: ${value}`);
      }
    });
  } else {
    console.log('infobox 테이블 없음\n');
  }

  // 3. 사이드바 정보
  console.log('─'.repeat(60));
  console.log('3. 사이드바 정보:');
  console.log('─'.repeat(60));

  const sidebar = $('#infobox');
  if (sidebar.length > 0) {
    console.log('사이드바 HTML:');
    console.log(sidebar.html().substring(0, 500));
    console.log('...\n');
  } else {
    console.log('사이드바 없음\n');
  }

  // 4. script 태그 내 데이터
  console.log('─'.repeat(60));
  console.log('4. script 태그 내 추가 데이터:');
  console.log('─'.repeat(60));

  let foundData = false;
  $('script').each((i, el) => {
    const html = $(el).html();
    if (html && html.includes('g_spells')) {
      console.log(`스크립트 ${i + 1}: g_spells 데이터 발견`);
      console.log(html.substring(0, 500));
      console.log('...\n');
      foundData = true;
      return false;
    }
  });

  if (!foundData) {
    console.log('g_spells 데이터 없음\n');
  }

  // 5. 메타 태그 정보
  console.log('─'.repeat(60));
  console.log('5. 메타 태그 정보:');
  console.log('─'.repeat(60));

  const metaTags = {
    title: $('title').text(),
    description: $('meta[name="description"]').attr('content'),
    keywords: $('meta[name="keywords"]').attr('content')
  };

  console.log(JSON.stringify(metaTags, null, 2));

} catch (error) {
  console.error('에러:', error.message);
}
