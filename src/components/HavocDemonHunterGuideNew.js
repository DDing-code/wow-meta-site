/**
 * HavocDemonHunterGuideNew.js - 새 모듈 시스템 버전
 * 
 * 이 파일은 guide-modules 시스템을 사용하여
 * JSON 데이터만으로 전체 가이드를 렌더링합니다.
 * 
 * 생성일: 2025-11-28
 */

import React from 'react';
import { GuidePageWrapper } from './guide-modules/UniversalGuideRenderer';
import guideData from '../data/guides/demonhunter-new.json';

const HavocDemonHunterGuideNew = () => (
  <GuidePageWrapper guideData={guideData} specKey="havoc" />
);

export default HavocDemonHunterGuideNew;
