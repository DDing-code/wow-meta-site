// TGA to PNG 변환 서비스
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // 설치 필요: npm install sharp

class TGAConverter {
  constructor() {
    this.sourceDir = path.join(__dirname, '../../public/icons');
    this.outputDir = path.join(__dirname, '../../public/icons/png');
  }

  // TGA 파일 읽기 (기본 구조)
  readTGA(filePath) {
    const buffer = fs.readFileSync(filePath);

    // TGA 헤더 구조 파싱
    const header = {
      idLength: buffer[0],
      colorMapType: buffer[1],
      imageType: buffer[2],
      colorMapSpec: {
        firstEntryIndex: buffer.readUInt16LE(3),
        colorMapLength: buffer.readUInt16LE(5),
        colorMapEntrySize: buffer[7]
      },
      imageSpec: {
        xOrigin: buffer.readUInt16LE(8),
        yOrigin: buffer.readUInt16LE(10),
        width: buffer.readUInt16LE(12),
        height: buffer.readUInt16LE(14),
        pixelDepth: buffer[16],
        imageDescriptor: buffer[17]
      }
    };

    // 이미지 데이터 시작 위치
    const dataStart = 18 + header.idLength;
    const imageData = buffer.slice(dataStart);

    return {
      header,
      data: imageData,
      width: header.imageSpec.width,
      height: header.imageSpec.height,
      depth: header.imageSpec.pixelDepth
    };
  }

  // TGA를 PNG로 변환 (sharp 라이브러리 사용)
  async convertTGAToPNG(tgaPath, pngPath) {
    try {
      const tgaData = this.readTGA(tgaPath);

      // Raw 이미지 데이터를 sharp로 처리
      // TGA는 일반적으로 BGRA 형식
      const channels = tgaData.depth === 32 ? 4 : 3;

      await sharp(tgaData.data, {
        raw: {
          width: tgaData.width,
          height: tgaData.height,
          channels: channels
        }
      })
      .png()
      .toFile(pngPath);

      console.log(`변환 완료: ${path.basename(tgaPath)} -> ${path.basename(pngPath)}`);
      return true;
    } catch (error) {
      console.error(`변환 실패: ${tgaPath}`, error.message);
      return false;
    }
  }

  // 모든 TGA 파일 변환
  async convertAllTGAs() {
    // 출력 디렉토리 생성
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // TGA 파일 목록 가져오기
    const files = fs.readdirSync(this.sourceDir)
      .filter(file => path.extname(file).toLowerCase() === '.tga');

    console.log(`${files.length}개의 TGA 파일을 찾았습니다.`);

    let converted = 0;
    let failed = 0;

    for (const file of files) {
      const tgaPath = path.join(this.sourceDir, file);
      const pngName = path.basename(file, '.tga') + '.png';
      const pngPath = path.join(this.outputDir, pngName);

      // 이미 변환된 경우 스킵
      if (fs.existsSync(pngPath)) {
        console.log(`스킵: ${pngName} (이미 존재함)`);
        continue;
      }

      const success = await this.convertTGAToPNG(tgaPath, pngPath);
      if (success) {
        converted++;
      } else {
        failed++;
      }
    }

    console.log(`\n변환 완료: ${converted}개 성공, ${failed}개 실패`);
    return { converted, failed, total: files.length };
  }

  // 특정 아이콘 변환
  async convertIcon(iconName) {
    const tgaPath = path.join(this.sourceDir, `${iconName}.tga`);
    const pngPath = path.join(this.outputDir, `${iconName}.png`);

    if (!fs.existsSync(tgaPath)) {
      throw new Error(`TGA 파일을 찾을 수 없습니다: ${iconName}.tga`);
    }

    return await this.convertTGAToPNG(tgaPath, pngPath);
  }

  // 클래스별 아이콘 일괄 변환
  async convertClassIcons(className) {
    const pattern = `ability_${className}_`;
    const files = fs.readdirSync(this.sourceDir)
      .filter(file => file.toLowerCase().startsWith(pattern) && file.endsWith('.tga'));

    console.log(`${className} 클래스 아이콘 ${files.length}개 변환 시작...`);

    let converted = 0;
    for (const file of files) {
      const tgaPath = path.join(this.sourceDir, file);
      const pngName = path.basename(file, '.tga') + '.png';
      const pngPath = path.join(this.outputDir, pngName);

      if (await this.convertTGAToPNG(tgaPath, pngPath)) {
        converted++;
      }
    }

    return converted;
  }
}

// 단독 실행 시
if (require.main === module) {
  const converter = new TGAConverter();

  // 명령줄 인자 처리
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'all') {
    // 모든 TGA 변환
    converter.convertAllTGAs().then(result => {
      console.log('변환 작업 완료:', result);
    });
  } else if (args[0] === 'class' && args[1]) {
    // 특정 클래스 아이콘만 변환
    converter.convertClassIcons(args[1]).then(count => {
      console.log(`${args[1]} 클래스 아이콘 ${count}개 변환 완료`);
    });
  } else if (args[0]) {
    // 특정 아이콘만 변환
    converter.convertIcon(args[0]).then(() => {
      console.log(`${args[0]} 아이콘 변환 완료`);
    });
  }
}

module.exports = TGAConverter;