// 파일 기반 DB (MongoDB 대체)
const fs = require('fs').promises;
const path = require('path');

class FileDB {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.learningFile = path.join(this.dataDir, 'learning_data.json');
    this.init();
  }

  async init() {
    try {
      // data 디렉토리 생성
      await fs.mkdir(this.dataDir, { recursive: true });

      // 파일이 없으면 생성
      try {
        await fs.access(this.learningFile);
      } catch {
        await fs.writeFile(this.learningFile, JSON.stringify([]));
        console.log('📁 학습 데이터 파일 생성됨');
      }
    } catch (error) {
      console.error('FileDB 초기화 오류:', error);
    }
  }

  // 데이터 읽기
  async read() {
    try {
      const data = await fs.readFile(this.learningFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('데이터 읽기 오류:', error);
      return [];
    }
  }

  // 데이터 쓰기
  async write(data) {
    try {
      await fs.writeFile(this.learningFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('데이터 쓰기 오류:', error);
      return false;
    }
  }

  // 학습 데이터 저장
  async saveLearningData(learningData) {
    try {
      const allData = await this.read();

      // 중복 체크
      const existingIndex = allData.findIndex(item => item.logId === learningData.logId);

      if (existingIndex !== -1) {
        // 업데이트
        allData[existingIndex] = { ...allData[existingIndex], ...learningData };
      } else {
        // 새로 추가
        allData.push({
          ...learningData,
          _id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString()
        });
      }

      // 최대 10000개 유지 (메모리 관리)
      if (allData.length > 10000) {
        allData.splice(0, allData.length - 10000);
      }

      await this.write(allData);
      const className = learningData.className || learningData.class || 'unknown';
      const specName = learningData.specName || learningData.spec || 'unknown';
      console.log(`💾 학습 데이터 저장: ${className}_${specName}`);
      return true;
    } catch (error) {
      console.error('학습 데이터 저장 오류:', error);
      return false;
    }
  }

  // 상위 10% 로그 조회
  async getTop10Logs(className, spec, limit = 100) {
    try {
      const allData = await this.read();

      return allData
        .filter(item =>
          item.class === className &&
          item.spec === spec &&
          item.percentile >= 90
        )
        .sort((a, b) => b.percentile - a.percentile)
        .slice(0, limit);
    } catch (error) {
      console.error('상위 10% 로그 조회 오류:', error);
      return [];
    }
  }

  // 클래스 통계
  async getClassStatistics(className, spec) {
    try {
      const allData = await this.read();
      const filtered = allData.filter(item =>
        item.class === className &&
        item.spec === spec &&
        item.percentile >= 90
      );

      if (filtered.length === 0) {
        return {
          avgDPS: 0,
          maxDPS: 0,
          minDPS: 0,
          count: 0,
          avgPercentile: 0
        };
      }

      const dpsValues = filtered.map(item => item.dps);
      const percentiles = filtered.map(item => item.percentile);

      return {
        avgDPS: Math.round(dpsValues.reduce((a, b) => a + b, 0) / dpsValues.length),
        maxDPS: Math.max(...dpsValues),
        minDPS: Math.min(...dpsValues),
        count: filtered.length,
        avgPercentile: Math.round(percentiles.reduce((a, b) => a + b, 0) / percentiles.length)
      };
    } catch (error) {
      console.error('통계 조회 오류:', error);
      return {
        avgDPS: 0,
        maxDPS: 0,
        minDPS: 0,
        count: 0,
        avgPercentile: 0
      };
    }
  }

  // 최근 학습 데이터
  async getRecentLearning(hours = 24) {
    try {
      const allData = await this.read();
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

      return allData.filter(item =>
        new Date(item.timestamp || item.createdAt) >= cutoff
      ).sort((a, b) =>
        new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
      );
    } catch (error) {
      console.error('최근 데이터 조회 오류:', error);
      return [];
    }
  }

  // 데이터 정리
  async cleanup(days = 30) {
    try {
      const allData = await this.read();
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const filtered = allData.filter(item =>
        item.isRealData || new Date(item.timestamp || item.createdAt) >= cutoff
      );

      const deleted = allData.length - filtered.length;
      await this.write(filtered);

      console.log(`🗑️ ${deleted}개의 오래된 데이터 삭제`);
      return deleted;
    } catch (error) {
      console.error('데이터 정리 오류:', error);
      return 0;
    }
  }
}

// 싱글톤 인스턴스
const fileDB = new FileDB();
module.exports = fileDB;