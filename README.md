# WoW Meta Site

12.0.5 Knowledge Base를 기준으로 직업 가이드와 스펠 데이터베이스를 다시 만드는 React 사이트입니다.

## 구조

- `src/App.js`: 라우트 셸
- `src/pages/GuidePage.js`: 직업/전문화 가이드 인덱스
- `src/pages/WoWSpellDatabasePage.js`: KB 기반 스펠 DB
- `src/data/kb-skills.json`: KB 빌드 산출물
- `src/data/kb-synergies.json`: KB 시너지 산출물
- `scripts/sync-kb.js`: 루트 KB 빌더 래퍼

## 명령어

```bash
npm run dev
npm run build
npm run validate
```

## 기준

- KB 마스터: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base`
- 현재 패치: `12.0.5`
- 구버전 가이드 구현, 실험용 크롤러, 임시 데이터 파일은 제거했습니다.
