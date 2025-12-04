import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { GuideGenerator } from './GuideGenerator.js';

/**
 * GuideWatcher - 파일 변경 감지 및 자동 재생성
 *
 * 기능:
 * - Watch 모드: 마크다운 파일 변경 감지
 * - 증분 빌드: 변경된 파일만 재생성
 * - 디바운싱: 연속된 변경을 묶어서 처리
 * - 에러 복구: Watch 중 에러 발생 시 자동 재시작
 */

export class GuideWatcher {
  constructor(options = {}) {
    this.options = {
      watchDir: options.watchDir || path.join(process.cwd(), 'WoW-Meta-Knowledge', '02-전문화별-가이드'),
      debounceMs: options.debounceMs || 1000,  // 1초 디바운스
      verbose: options.verbose !== false,
      ...options
    };

    this.watchers = new Map();
    this.changeQueue = new Map();
    this.debounceTimers = new Map();
    this.fileHashes = new Map();  // 파일 해시로 실제 변경 감지
    this.isProcessing = false;
  }

  /**
   * Watch 모드 시작
   */
  async start() {
    console.log('🔍 Guide Watcher 시작...\n');
    console.log(`📂 감시 디렉토리: ${this.options.watchDir}`);
    console.log(`⏱️  디바운스: ${this.options.debounceMs}ms`);
    console.log(`🔄 증분 빌드 활성화\n`);

    try {
      // 초기 빌드 (변경사항만)
      await this.initialBuild();

      // 파일 감시 시작
      await this.watchDirectory(this.options.watchDir);

      console.log('✅ Watch 모드 활성화 (Ctrl+C로 종료)\n');

      // 프로세스 종료 시 정리
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());

    } catch (error) {
      console.error('❌ Watch 모드 시작 실패:', error.message);
      throw error;
    }
  }

  /**
   * 초기 빌드 (변경된 파일만)
   */
  async initialBuild() {
    console.log('📦 초기 증분 빌드 시작...\n');

    try {
      const files = await this.findGuideFiles(this.options.watchDir);
      let changedCount = 0;
      let skippedCount = 0;

      for (const file of files) {
        const changed = await this.hasFileChanged(file);

        if (changed) {
          console.log(`  🔄 변경 감지: ${path.basename(file)}`);
          await this.processFile(file);
          changedCount++;
        } else {
          if (this.options.verbose) {
            console.log(`  ⏭️  변경 없음: ${path.basename(file)}`);
          }
          skippedCount++;
        }
      }

      console.log(`\n✅ 초기 빌드 완료: ${changedCount}개 업데이트, ${skippedCount}개 스킵\n`);

    } catch (error) {
      console.error('❌ 초기 빌드 실패:', error.message);
    }
  }

  /**
   * 디렉토리 감시
   */
  async watchDirectory(dir) {
    try {
      const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        const filePath = path.join(dir, filename);

        // 마크다운 파일만 감시
        if (path.extname(filename) === '.md') {
          this.handleFileChange(filePath, eventType);
        }
      });

      this.watchers.set(dir, watcher);

      watcher.on('error', (error) => {
        console.error(`❌ 감시 에러 (${dir}):`, error.message);
        this.restartWatcher(dir);
      });

    } catch (error) {
      console.error(`❌ 디렉토리 감시 실패 (${dir}):`, error.message);
      throw error;
    }
  }

  /**
   * 파일 변경 핸들러 (디바운싱 적용)
   */
  handleFileChange(filePath, eventType) {
    // 기존 타이머 취소
    if (this.debounceTimers.has(filePath)) {
      clearTimeout(this.debounceTimers.get(filePath));
    }

    // 새 타이머 설정
    const timer = setTimeout(async () => {
      this.debounceTimers.delete(filePath);

      try {
        // 파일 존재 확인
        const exists = fs.existsSync(filePath);

        if (!exists) {
          console.log(`🗑️  파일 삭제: ${path.basename(filePath)}`);
          this.fileHashes.delete(filePath);
          return;
        }

        // 실제 변경 여부 확인 (해시 비교)
        const changed = await this.hasFileChanged(filePath);

        if (changed) {
          console.log(`\n📝 파일 변경 감지: ${path.basename(filePath)}`);
          await this.processFile(filePath);
          console.log(`✅ 재생성 완료\n`);
        }

      } catch (error) {
        console.error(`❌ 파일 처리 실패 (${path.basename(filePath)}):`, error.message);
      }

    }, this.options.debounceMs);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * 파일 실제 변경 여부 확인 (해시 비교)
   */
  async hasFileChanged(filePath) {
    try {
      const content = await fsPromises.readFile(filePath, 'utf8');
      const newHash = this.simpleHash(content);
      const oldHash = this.fileHashes.get(filePath);

      if (oldHash === newHash) {
        return false;  // 변경 없음
      }

      // 해시 업데이트
      this.fileHashes.set(filePath, newHash);
      return true;  // 변경됨

    } catch (error) {
      // 파일 읽기 실패 = 새 파일로 간주
      return true;
    }
  }

  /**
   * 간단한 해시 함수 (내용 비교용)
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * 파일 처리 (GuideGenerator 호출)
   */
  async processFile(filePath) {
    try {
      // 마크다운 파일에서 className과 specName 추출
      const content = await fsPromises.readFile(filePath, 'utf8');
      const metadata = this.extractMetadata(content);

      if (!metadata.class || !metadata.spec) {
        console.warn(`⚠️  메타데이터 누락: ${path.basename(filePath)}`);
        return;
      }

      // GuideGenerator 호출
      const generator = new GuideGenerator(
        metadata.class,
        metadata.spec,
        { config: {}, rotation: {}, talents: {}, stats: {}, skills: {} }
      );

      await generator.generate();

    } catch (error) {
      console.error(`❌ 파일 처리 실패:`, error.message);
      throw error;
    }
  }

  /**
   * 마크다운 frontmatter에서 메타데이터 추출
   */
  extractMetadata(content) {
    const metadata = {};

    // frontmatter 추출 (--- ... ---)
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];

      // class 추출
      const classMatch = frontmatter.match(/class:\s*(\w+)/);
      if (classMatch) {
        metadata.class = classMatch[1];
      }

      // spec 추출
      const specMatch = frontmatter.match(/spec:\s*(\w+)/);
      if (specMatch) {
        metadata.spec = specMatch[1];
      }
    }

    return metadata;
  }

  /**
   * 가이드 파일 목록 찾기
   */
  async findGuideFiles(dir) {
    const files = [];

    try {
      const entries = await fsPromises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // 재귀적으로 탐색
          const subFiles = await this.findGuideFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && path.extname(entry.name) === '.md') {
          files.push(fullPath);
        }
      }

    } catch (error) {
      console.error(`❌ 파일 탐색 실패 (${dir}):`, error.message);
    }

    return files;
  }

  /**
   * 감시 재시작 (에러 복구)
   */
  async restartWatcher(dir) {
    console.log(`🔄 감시 재시작 중: ${dir}`);

    try {
      // 기존 watcher 종료
      const oldWatcher = this.watchers.get(dir);
      if (oldWatcher) {
        oldWatcher.close();
      }

      // 새 watcher 시작
      await new Promise(resolve => setTimeout(resolve, 1000));  // 1초 대기
      await this.watchDirectory(dir);

      console.log(`✅ 감시 재시작 완료: ${dir}`);

    } catch (error) {
      console.error(`❌ 감시 재시작 실패: ${dir}`, error.message);
    }
  }

  /**
   * Watch 모드 중지
   */
  stop() {
    console.log('\n\n🛑 Watch 모드 종료 중...');

    // 모든 watcher 종료
    for (const [dir, watcher] of this.watchers.entries()) {
      watcher.close();
      console.log(`  ✅ 감시 중지: ${dir}`);
    }

    // 타이머 정리
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }

    console.log('✅ 정리 완료\n');
    process.exit(0);
  }
}

/**
 * CLI 실행
 */
async function main() {
  const watcher = new GuideWatcher({
    watchDir: path.join(process.cwd(), '..', 'WoW-Meta-Knowledge', '02-전문화별-가이드'),
    debounceMs: 1000,
    verbose: true
  });

  await watcher.start();
}

// 직접 실행 시
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  main().catch(error => {
    console.error('❌ Watcher 실행 실패:', error);
    process.exit(1);
  });
}

export default GuideWatcher;
