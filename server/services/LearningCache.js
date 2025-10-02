// 학습 데이터 캐시 서비스
const fs = require('fs');
const path = require('path');

class LearningCache {
  constructor() {
    this.memoryCache = new Map();
    this.cacheDir = path.join(__dirname, '..', 'cache');
    this.maxAge = 5 * 60 * 1000; // 5분
    this.initCache();
  }

  initCache() {
    // 캐시 디렉토리 생성
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  // 캐시 키 생성
  getCacheKey(className, specName) {
    return `${className}_${specName}`;
  }

  // 메모리 캐시 확인
  getFromMemory(className, specName) {
    const key = this.getCacheKey(className, specName);
    const cached = this.memoryCache.get(key);

    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.maxAge) {
        console.log(`✅ 메모리 캐시 적중: ${key} (${Math.floor(age / 1000)}초 경과)`);
        return cached.data;
      } else {
        console.log(`⏰ 메모리 캐시 만료: ${key}`);
        this.memoryCache.delete(key);
      }
    }

    return null;
  }

  // 파일 캐시 확인
  getFromFile(className, specName) {
    const key = this.getCacheKey(className, specName);
    const filePath = path.join(this.cacheDir, `${key}.json`);

    if (fs.existsSync(filePath)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const age = Date.now() - fileData.timestamp;

        if (age < this.maxAge) {
          console.log(`📁 파일 캐시 적중: ${key} (${Math.floor(age / 1000)}초 경과)`);

          // 메모리 캐시에도 저장
          this.memoryCache.set(key, fileData);

          return fileData.data;
        } else {
          console.log(`⏰ 파일 캐시 만료: ${key}`);
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`캐시 파일 읽기 오류: ${err.message}`);
      }
    }

    return null;
  }

  // 캐시 가져오기
  get(className, specName) {
    // 먼저 메모리 캐시 확인
    let data = this.getFromMemory(className, specName);

    // 메모리에 없으면 파일 캐시 확인
    if (!data) {
      data = this.getFromFile(className, specName);
    }

    return data;
  }

  // 캐시 저장
  set(className, specName, data) {
    const key = this.getCacheKey(className, specName);
    const cacheData = {
      data: data,
      timestamp: Date.now(),
      className: className,
      specName: specName
    };

    // 메모리 캐시에 저장
    this.memoryCache.set(key, cacheData);
    console.log(`💾 메모리 캐시 저장: ${key}`);

    // 파일 캐시에 저장 (비동기)
    const filePath = path.join(this.cacheDir, `${key}.json`);
    fs.writeFile(filePath, JSON.stringify(cacheData, null, 2), err => {
      if (err) {
        console.error(`캐시 파일 저장 오류: ${err.message}`);
      } else {
        console.log(`💾 파일 캐시 저장: ${key}`);
      }
    });
  }

  // 캐시 삭제
  delete(className, specName) {
    const key = this.getCacheKey(className, specName);

    // 메모리 캐시 삭제
    this.memoryCache.delete(key);

    // 파일 캐시 삭제
    const filePath = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // 모든 캐시 삭제
  clear() {
    // 메모리 캐시 클리어
    this.memoryCache.clear();

    // 파일 캐시 클리어
    const files = fs.readdirSync(this.cacheDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(this.cacheDir, file));
      }
    });

    console.log('🗑️ 모든 캐시 삭제 완료');
  }

  // 캐시 상태 조회
  getStatus() {
    const memoryKeys = Array.from(this.memoryCache.keys());
    const files = fs.readdirSync(this.cacheDir).filter(f => f.endsWith('.json'));

    return {
      memoryCache: memoryKeys.length,
      fileCache: files.length,
      maxAge: this.maxAge / 1000,
      items: memoryKeys.map(key => {
        const cached = this.memoryCache.get(key);
        return {
          key: key,
          age: cached ? Math.floor((Date.now() - cached.timestamp) / 1000) : 0,
          ttl: cached ? Math.floor((this.maxAge - (Date.now() - cached.timestamp)) / 1000) : 0
        };
      })
    };
  }
}

// 싱글톤 인스턴스
module.exports = new LearningCache();