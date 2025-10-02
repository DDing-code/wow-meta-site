// 브라우저 큐 시스템 - 동시 실행 방지
class BrowserQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.currentBrowser = null;
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const { task, resolve, reject } = this.queue.shift();

    try {
      console.log(`🔄 브라우저 작업 시작 (대기 중: ${this.queue.length}개)`);
      const result = await task();
      resolve(result);
    } catch (error) {
      console.error('❌ 브라우저 작업 실패:', error.message);
      reject(error);
    } finally {
      this.isProcessing = false;

      // 다음 작업 처리
      if (this.queue.length > 0) {
        setTimeout(() => this.process(), 1000); // 1초 대기 후 다음 작업
      }
    }
  }

  getQueueLength() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
    this.isProcessing = false;
  }
}

module.exports = new BrowserQueue();