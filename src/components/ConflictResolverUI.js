import React, { useState, useEffect } from 'react';
import moduleEventBus from '../services/ModuleEventBus.js';
import './ConflictResolverUI.css';

/**
 * ConflictResolverUI.js - 지식 충돌 해결 React 컴포넌트
 *
 * Purpose: KnowledgeStructurer가 감지한 데이터 충돌을 시각화하고 사용자 선택 수집
 *
 * Workflow:
 * 1. ModuleEventBus에서 'knowledge-conflict-detected' 이벤트 리스닝
 * 2. 기존 데이터 vs 새 데이터 side-by-side 비교 표시
 * 3. 사용자가 각 충돌에 대해 선택 (기존 유지 / 새 데이터로 교체 / 병합)
 * 4. 모든 선택 완료 후 callback으로 결과 반환
 */

const ConflictResolverUI = () => {
  const [conflicts, setConflicts] = useState([]);
  const [resolutions, setResolutions] = useState({});
  const [callback, setCallback] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // ModuleEventBus에서 충돌 이벤트 리스닝
    const handleConflictDetected = ({ conflicts, callback }) => {
      console.log('🔍 충돌 감지됨:', conflicts.length, '개');
      setConflicts(conflicts);
      setCallback(() => callback);
      setIsOpen(true);

      // 기본 선택: 모든 충돌에 대해 '기존 유지'
      const defaultResolutions = {};
      conflicts.forEach((conflict, index) => {
        defaultResolutions[index] = {
          action: 'keep-existing',
          path: conflict.path
        };
      });
      setResolutions(defaultResolutions);
    };

    moduleEventBus.on('knowledge-conflict-detected', handleConflictDetected);

    return () => {
      moduleEventBus.off('knowledge-conflict-detected', handleConflictDetected);
    };
  }, []);

  // 충돌 해결 선택 변경
  const handleResolutionChange = (conflictIndex, action) => {
    setResolutions(prev => ({
      ...prev,
      [conflictIndex]: {
        action: action,
        path: conflicts[conflictIndex].path
      }
    }));
  };

  // 병합 데이터 커스터마이징
  const handleMergeCustomization = (conflictIndex, mergedData) => {
    setResolutions(prev => ({
      ...prev,
      [conflictIndex]: {
        action: 'merge',
        path: conflicts[conflictIndex].path,
        mergedData: mergedData
      }
    }));
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    console.log('✅ 사용자 선택 확인:', resolutions);

    if (callback) {
      callback(resolutions);
    }

    // UI 초기화
    setIsOpen(false);
    setConflicts([]);
    setResolutions({});
    setCallback(null);
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    console.warn('⚠️ 충돌 해결 취소됨');

    if (callback) {
      // 모든 충돌에 대해 '기존 유지' 선택으로 반환
      const cancelResolutions = {};
      conflicts.forEach((conflict, index) => {
        cancelResolutions[index] = {
          action: 'keep-existing',
          path: conflict.path
        };
      });
      callback(cancelResolutions);
    }

    setIsOpen(false);
    setConflicts([]);
    setResolutions({});
    setCallback(null);
  };

  // 차이점 렌더링
  const renderDifference = (diff) => {
    return (
      <div className="difference-item">
        <div className="diff-field">{diff.field}</div>
        <div className="diff-comparison">
          <div className="diff-existing">
            <strong>기존:</strong> {JSON.stringify(diff.existingValue)}
          </div>
          <div className="diff-arrow">→</div>
          <div className="diff-new">
            <strong>새 데이터:</strong> {JSON.stringify(diff.newValue)}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="conflict-resolver-overlay">
      <div className="conflict-resolver-modal">
        <div className="modal-header">
          <h2>🔍 지식 충돌 감지</h2>
          <p className="conflict-count">
            총 {conflicts.length}개의 충돌이 발견되었습니다.
          </p>
        </div>

        <div className="modal-body">
          {conflicts.map((conflict, index) => (
            <div key={index} className="conflict-card">
              <div className="conflict-header">
                <h3 className="conflict-path">📄 {conflict.path}</h3>
                <div className="conflict-resolution-selector">
                  <label>
                    <input
                      type="radio"
                      name={`resolution-${index}`}
                      value="keep-existing"
                      checked={resolutions[index]?.action === 'keep-existing'}
                      onChange={() => handleResolutionChange(index, 'keep-existing')}
                    />
                    기존 유지
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`resolution-${index}`}
                      value="use-new"
                      checked={resolutions[index]?.action === 'use-new'}
                      onChange={() => handleResolutionChange(index, 'use-new')}
                    />
                    새 데이터 사용
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`resolution-${index}`}
                      value="merge"
                      checked={resolutions[index]?.action === 'merge'}
                      onChange={() => handleResolutionChange(index, 'merge')}
                    />
                    병합
                  </label>
                </div>
              </div>

              <div className="conflict-differences">
                <h4>차이점:</h4>
                {conflict.differences.map((diff, diffIndex) => (
                  <div key={diffIndex}>
                    {renderDifference(diff)}
                  </div>
                ))}
              </div>

              {resolutions[index]?.action === 'merge' && (
                <div className="merge-editor">
                  <h4>병합 데이터 편집:</h4>
                  <textarea
                    className="merge-textarea"
                    defaultValue={JSON.stringify(
                      { ...conflict.existing, ...conflict.new },
                      null,
                      2
                    )}
                    onChange={(e) => {
                      try {
                        const mergedData = JSON.parse(e.target.value);
                        handleMergeCustomization(index, mergedData);
                      } catch (err) {
                        console.error('JSON 파싱 실패:', err);
                      }
                    }}
                    rows={10}
                  />
                  <p className="merge-hint">
                    ℹ️ JSON 형식으로 병합된 데이터를 편집하세요.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            ❌ 취소 (모두 기존 유지)
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            ✅ 확인 ({Object.keys(resolutions).length}/{conflicts.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolverUI;
