/**
 * 분노 전사 가이드 (래퍼 컴포넌트)
 *
 * GuideTemplate과 furyWarriorConfig를 결합하여
 * 분노 전사 가이드를 렌더링합니다.
 *
 * 이전: 4,065줄의 단일 파일
 * 현재: 10줄의 래퍼 (데이터 분리)
 */

import React from 'react';
import GuideTemplate from './GuideTemplate.js';
import furyWarriorConfig from '../configs/furyWarriorConfig.js';

const FuryWarriorGuide = () => {
  return <GuideTemplate {...furyWarriorConfig} />;
};

export default FuryWarriorGuide;
