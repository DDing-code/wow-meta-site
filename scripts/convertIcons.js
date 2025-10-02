// TGA to PNG 변환 스크립트
// WoW 아이콘을 웹에서 사용 가능한 PNG 형식으로 변환

const fs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');

// TGA 헤더 구조
class TGAReader {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
    this.header = this.readHeader();
  }

  readHeader() {
    const header = {
      idLength: this.buffer[0],
      colorMapType: this.buffer[1],
      imageType: this.buffer[2],
      colorMapFirstEntryIndex: this.buffer.readUInt16LE(3),
      colorMapLength: this.buffer.readUInt16LE(5),
      colorMapEntrySize: this.buffer[7],
      xOrigin: this.buffer.readUInt16LE(8),
      yOrigin: this.buffer.readUInt16LE(10),
      width: this.buffer.readUInt16LE(12),
      height: this.buffer.readUInt16LE(14),
      pixelDepth: this.buffer[16],
      imageDescriptor: this.buffer[17]
    };

    this.offset = 18 + header.idLength;

    // 컬러맵이 있으면 스킵
    if (header.colorMapType === 1) {
      const colorMapSize = header.colorMapLength * (header.colorMapEntrySize / 8);
      this.offset += colorMapSize;
    }

    return header;
  }

  getImageData() {
    const { width, height, pixelDepth, imageType } = this.header;
    const bytesPerPixel = pixelDepth / 8;
    const imageSize = width * height * bytesPerPixel;
    const imageData = this.buffer.slice(this.offset, this.offset + imageSize);

    // RLE 압축된 경우 (imageType 10)
    if (imageType === 10) {
      return this.decodeRLE(imageData, width, height, bytesPerPixel);
    }

    return imageData;
  }

  decodeRLE(data, width, height, bytesPerPixel) {
    const pixels = Buffer.alloc(width * height * bytesPerPixel);
    let dataOffset = 0;
    let pixelOffset = 0;

    while (pixelOffset < pixels.length) {
      const packet = data[dataOffset++];
      const count = (packet & 0x7F) + 1;

      if (packet & 0x80) {
        // RLE 패킷
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < bytesPerPixel; j++) {
            pixels[pixelOffset++] = data[dataOffset + j];
          }
        }
        dataOffset += bytesPerPixel;
      } else {
        // Raw 패킷
        for (let i = 0; i < count * bytesPerPixel; i++) {
          pixels[pixelOffset++] = data[dataOffset++];
        }
      }
    }

    return pixels;
  }
}

// TGA를 PNG로 변환
async function convertTGAToPNG(tgaPath, pngPath) {
  try {
    const tgaBuffer = fs.readFileSync(tgaPath);
    const tga = new TGAReader(tgaBuffer);
    const { width, height, pixelDepth } = tga.header;

    // 캔버스 생성
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 이미지 데이터 생성
    const imageData = ctx.createImageData(width, height);
    const tgaData = tga.getImageData();
    const bytesPerPixel = pixelDepth / 8;

    // TGA 데이터를 Canvas ImageData로 변환
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tgaIndex = ((height - 1 - y) * width + x) * bytesPerPixel; // TGA는 bottom-up
        const canvasIndex = (y * width + x) * 4;

        if (bytesPerPixel === 4) {
          // BGRA -> RGBA
          imageData.data[canvasIndex] = tgaData[tgaIndex + 2];     // R
          imageData.data[canvasIndex + 1] = tgaData[tgaIndex + 1]; // G
          imageData.data[canvasIndex + 2] = tgaData[tgaIndex];     // B
          imageData.data[canvasIndex + 3] = tgaData[tgaIndex + 3]; // A
        } else if (bytesPerPixel === 3) {
          // BGR -> RGBA
          imageData.data[canvasIndex] = tgaData[tgaIndex + 2];     // R
          imageData.data[canvasIndex + 1] = tgaData[tgaIndex + 1]; // G
          imageData.data[canvasIndex + 2] = tgaData[tgaIndex];     // B
          imageData.data[canvasIndex + 3] = 255;                   // A
        }
      }
    }

    // ImageData를 캔버스에 그리기
    ctx.putImageData(imageData, 0, 0);

    // PNG로 저장
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);

    return true;
  } catch (error) {
    console.error(`변환 실패 ${path.basename(tgaPath)}:`, error.message);
    return false;
  }
}

// Wowhead CDN 사용하는 대체 방법
function useWowheadFallback() {
  console.log('\n=== Wowhead CDN 사용 권장 ===');
  console.log('TGA 변환 대신 Wowhead CDN 사용을 권장합니다.');
  console.log('예시: https://wow.zamimg.com/images/wow/icons/large/[아이콘이름].jpg');
  console.log('');

  // 아이콘 매핑 생성
  const iconMappings = {
    // 전사
    'ability_warrior_savageblow': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
    'ability_warrior_colossussmash': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_colossussmash.jpg',
    'ability_warrior_bladestorm': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bladestorm.jpg',

    // 성기사
    'ability_paladin_bladeofjustice': 'https://wow.zamimg.com/images/wow/icons/large/ability_paladin_bladeofjustice.jpg',
    'spell_holy_righteousfury': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_righteousfury.jpg',
    'spell_paladin_templarsverdict': 'https://wow.zamimg.com/images/wow/icons/large/spell_paladin_templarsverdict.jpg',

    // 더 많은 아이콘 추가...
  };

  // 매핑 파일 저장
  const outputPath = path.join(__dirname, '../src/data/iconMappings.json');
  fs.writeFileSync(outputPath, JSON.stringify(iconMappings, null, 2));
  console.log(`아이콘 매핑 파일 생성: ${outputPath}`);
}

// 메인 실행
async function main() {
  const sourceDir = 'C:\\Users\\D2JK\\바탕화면\\cd\\냉죽\\ICONS';
  const targetDir = 'C:\\Users\\D2JK\\바탕화면\\cd\\냉죽\\wow-meta-site\\public\\icons\\png';

  // Canvas 라이브러리 확인
  try {
    require('canvas');
  } catch (e) {
    console.log('Canvas 라이브러리가 설치되지 않았습니다.');
    console.log('npm install canvas 명령으로 설치하거나,');
    console.log('Wowhead CDN을 사용하는 것을 권장합니다.\n');
    useWowheadFallback();
    return;
  }

  // PNG 디렉토리 생성
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // TGA 파일 목록
  const tgaFiles = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.tga'))
    .slice(0, 100); // 테스트로 100개만

  console.log(`${tgaFiles.length}개 TGA 파일 변환 시작...`);

  let converted = 0;
  for (const file of tgaFiles) {
    const tgaPath = path.join(sourceDir, file);
    const pngName = file.replace('.tga', '.png');
    const pngPath = path.join(targetDir, pngName);

    if (await convertTGAToPNG(tgaPath, pngPath)) {
      converted++;
      console.log(`✓ ${file} -> ${pngName}`);
    }
  }

  console.log(`\n변환 완료: ${converted}/${tgaFiles.length}`);
}

// 실행
if (require.main === module) {
  main();
}