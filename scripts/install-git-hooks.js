#!/usr/bin/env node

/**
 * Git Hook 설치 스크립트
 *
 * 실행 방법:
 *   node scripts/install-git-hooks.js
 *
 * 설치되는 Hook:
 *   - pre-commit: 커밋 전 가이드 자동 생성
 *   - post-merge: Pull/Merge 후 자동 동기화
 *   - post-checkout: Branch 전환 후 자동 동기화
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const gitHooksDir = path.join(projectRoot, '.git', 'hooks');

// Hook 스크립트 내용
const hooks = {
  // pre-commit: 커밋 전 증분 빌드
  'pre-commit': `#!/bin/sh
#
# Pre-commit Hook - 변경된 가이드 파일 자동 생성
# Obsidian 마크다운 변경 시 React 컴포넌트 자동 업데이트
#

echo "🔍 변경된 가이드 파일 감지 중..."

# 변경된 마크다운 파일 찾기
CHANGED_MD_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "02-전문화별-가이드.*\\.md$")

if [ -z "$CHANGED_MD_FILES" ]; then
  echo "✅ 변경된 가이드 파일 없음"
  exit 0
fi

echo "📝 변경된 가이드 파일:"
echo "$CHANGED_MD_FILES"
echo ""

# GuideWatcher를 사용한 증분 빌드
echo "⚡ 증분 빌드 실행 중..."

cd wow-meta-site

# Node.js 스크립트 실행
node -e "
import { GuideWatcher } from './src/generators/GuideWatcher.js';

(async () => {
  const watcher = new GuideWatcher({ verbose: false });
  await watcher.initialBuild();
  process.exit(0);
})();
"

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ 증분 빌드 실패 (Exit code: $BUILD_EXIT_CODE)"
  echo "   커밋을 중단합니다."
  exit 1
fi

echo "✅ 증분 빌드 완료"
echo ""

# 생성된 파일을 자동으로 staging area에 추가
echo "📦 생성된 파일을 커밋에 포함 중..."
git add src/specs/

echo "✅ Pre-commit Hook 완료"
exit 0
`,

  // post-merge: Pull/Merge 후 자동 동기화
  'post-merge': `#!/bin/sh
#
# Post-merge Hook - Pull/Merge 후 자동 동기화
# 다른 사람의 가이드 변경사항을 자동으로 빌드
#

echo "🔄 Post-merge 동기화 시작..."

# 마크다운 파일이 변경되었는지 확인
CHANGED_MD=$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep "02-전문화별-가이드.*\\.md$")

if [ -z "$CHANGED_MD" ]; then
  echo "✅ 가이드 파일 변경 없음"
  exit 0
fi

echo "📝 변경된 가이드 파일:"
echo "$CHANGED_MD"
echo ""

# 증분 빌드 실행
echo "⚡ 자동 동기화 중..."

cd wow-meta-site

node -e "
import { GuideWatcher } from './src/generators/GuideWatcher.js';

(async () => {
  const watcher = new GuideWatcher({ verbose: true });
  await watcher.initialBuild();
  process.exit(0);
})();
"

if [ $? -eq 0 ]; then
  echo "✅ 자동 동기화 완료"
else
  echo "⚠️  자동 동기화 실패 (수동 빌드 필요)"
fi

exit 0
`,

  // post-checkout: Branch 전환 후 자동 동기화
  'post-checkout': `#!/bin/sh
#
# Post-checkout Hook - Branch 전환 후 자동 동기화
# Branch 간 가이드 차이를 자동으로 빌드
#

PREV_HEAD=$1
NEW_HEAD=$2
BRANCH_CHECKOUT=$3

# Branch 전환이 아니면 종료 (파일 checkout은 무시)
if [ "$BRANCH_CHECKOUT" != "1" ]; then
  exit 0
fi

echo "🔄 Branch 전환 감지: 자동 동기화 시작..."

# 이전 HEAD와 새 HEAD 사이의 마크다운 변경 확인
CHANGED_MD=$(git diff --name-only $PREV_HEAD $NEW_HEAD | grep "02-전문화별-가이드.*\\.md$")

if [ -z "$CHANGED_MD" ]; then
  echo "✅ 가이드 파일 변경 없음"
  exit 0
fi

echo "📝 변경된 가이드 파일:"
echo "$CHANGED_MD"
echo ""

# 증분 빌드 실행
echo "⚡ 자동 동기화 중..."

cd wow-meta-site

node -e "
import { GuideWatcher } from './src/generators/GuideWatcher.js';

(async () => {
  const watcher = new GuideWatcher({ verbose: false });
  await watcher.initialBuild();
  process.exit(0);
})();
"

if [ $? -eq 0 ]; then
  echo "✅ 자동 동기화 완료"
else
  echo "⚠️  자동 동기화 실패 (수동 빌드 필요)"
fi

exit 0
`
};

// Git Hook 설치
function installHooks() {
  console.log('🔧 Git Hook 설치 시작...\n');

  // .git/hooks 디렉토리 확인
  if (!fs.existsSync(gitHooksDir)) {
    console.error('❌ .git/hooks 디렉토리를 찾을 수 없습니다.');
    console.error('   Git 저장소에서 실행하세요.');
    process.exit(1);
  }

  let installedCount = 0;
  let skippedCount = 0;

  // 각 Hook 설치
  for (const [hookName, hookContent] of Object.entries(hooks)) {
    const hookPath = path.join(gitHooksDir, hookName);

    try {
      // 기존 Hook이 있으면 백업
      if (fs.existsSync(hookPath)) {
        const backupPath = `${hookPath}.backup`;
        fs.copyFileSync(hookPath, backupPath);
        console.log(`  📦 기존 ${hookName} 백업: ${path.basename(backupPath)}`);
      }

      // Hook 파일 생성
      fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });

      console.log(`  ✅ ${hookName} 설치 완료`);
      installedCount++;

    } catch (error) {
      console.error(`  ❌ ${hookName} 설치 실패:`, error.message);
      skippedCount++;
    }
  }

  console.log(`\n✅ Git Hook 설치 완료: ${installedCount}개 성공, ${skippedCount}개 실패\n`);

  // 사용 가이드 출력
  console.log('📚 사용 가이드:');
  console.log('  - 커밋 시: 자동으로 변경된 가이드 빌드');
  console.log('  - Pull/Merge 후: 자동으로 동기화');
  console.log('  - Branch 전환 시: 자동으로 동기화');
  console.log('');
  console.log('🔧 Hook 제거:');
  console.log(`  rm -f ${gitHooksDir}/pre-commit`);
  console.log(`  rm -f ${gitHooksDir}/post-merge`);
  console.log(`  rm -f ${gitHooksDir}/post-checkout`);
  console.log('');
}

// 실행
installHooks();
