/**
 * DEMON-HUNTER HAVOC Rotations
 * Generated from SimulationCraft APL
 *
 * Data sources:
 * - SimulationCraft APL (primary)
 * - Wowhead Guide (validation)
 * - Generated: 2025-11-09T01:50:39.657Z
 */

export const rotations = {
  "aldrachireaver": {
    "singleTarget": {
      "opener": [
        {
          "priority": 0,
          "skill": "사냥",
          "skillId": "사냥",
          "condition": "항상",
          "why": "사냥 우선순위 0개 조건"
        },
        {
          "priority": 1,
          "skill": "복수의 후퇴",
          "skillId": "복수의 후퇴",
          "condition": "탈태 중 + 버프 활성",
          "why": "복수의 후퇴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 2,
          "skill": "죽음의 휩쓸기",
          "skillId": "죽음의 휩쓸기",
          "condition": "탈태 쿨 + 버프 활성",
          "why": "죽음의 휩쓸기을(를) 탈태 중 사용"
        },
        {
          "priority": 3,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성",
          "why": "소멸 우선순위 2개 조건"
        },
        {
          "priority": 4,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 적 2+",
          "why": "다수 대상 상황에서 지옥칼날 사용"
        },
        {
          "priority": 5,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 지옥 돌진 사용"
        },
        {
          "priority": 6,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 쿨다운 완료",
          "why": "소멸 쿨다운 최적화"
        },
        {
          "priority": 7,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "버프 활성 + 탈태 중",
          "why": "정수 붕괴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 8,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 쿨다운 완료 + 탈태 쿨",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 9,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 중 + 적 2+",
          "why": "지옥칼날을(를) 탈태 중 사용"
        },
        {
          "priority": 10,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성 + 탈태 중 + 적 2+",
          "why": "지옥 돌진을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 11,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 중 + 탈태 쿨",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 12,
          "skill": "사냥",
          "skillId": "사냥",
          "condition": "탈태 중 + 버프 활성",
          "why": "사냥을(를) 탈태 중 사용"
        },
        {
          "priority": 13,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "격노 40+ + 버프 활성",
          "why": "격노 생성/소모를 위한 지옥칼날 사용"
        },
        {
          "priority": 14,
          "skill": "파괴자의 글레이브",
          "skillId": "파괴자의 글레이브",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 파괴자의 글레이브 사용"
        },
        {
          "priority": 15,
          "skill": "혼돈 일격",
          "skillId": "혼돈 일격",
          "condition": "버프 활성",
          "why": "혼돈 일격 우선순위 2개 조건"
        },
        {
          "priority": 16,
          "skill": "칼춤",
          "skillId": "칼춤",
          "condition": "버프 활성",
          "why": "칼춤 우선순위 2개 조건"
        },
        {
          "priority": 17,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "탈태 중",
          "why": "불타는 오라을(를) 탈태 중 사용"
        },
        {
          "priority": 18,
          "skill": "탈태 변신",
          "skillId": "탈태 변신",
          "condition": "탈태 중 + 버프 활성",
          "why": "탈태 변신을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 19,
          "skill": "악의의 인장",
          "skillId": "악의의 인장",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "악의의 인장을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 20,
          "skill": "안광",
          "skillId": "안광",
          "condition": "탈태 중 + 버프 활성 + 쿨다운 완료",
          "why": "안광을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 21,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "탈태 중 + 탈태 쿨",
          "why": "정수 붕괴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 22,
          "skill": "죽음의 휩쓸기",
          "skillId": "죽음의 휩쓸기",
          "condition": "항상",
          "why": "죽음의 휩쓸기 우선순위 0개 조건"
        },
        {
          "priority": 23,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "항상",
          "why": "소멸 우선순위 0개 조건"
        },
        {
          "priority": 24,
          "skill": "악마의 이빨",
          "skillId": "악마의 이빨",
          "condition": "항상",
          "why": "악마의 이빨 우선순위 0개 조건"
        },
        {
          "priority": 25,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "쿨다운 완료 + 격노 40+",
          "why": "격노 생성/소모를 위한 지옥칼날 사용"
        },
        {
          "priority": 26,
          "skill": "사냥",
          "skillId": "사냥",
          "condition": "버프 활성",
          "why": "사냥 우선순위 1개 조건"
        },
        {
          "priority": 27,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 중 + 적 2+",
          "why": "지옥칼날을(를) 탈태 중 사용"
        },
        {
          "priority": 28,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성 + 탈태 중 + 적 2+",
          "why": "지옥 돌진을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 29,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "쿨다운 완료",
          "why": "불타는 오라 우선순위 3개 조건"
        },
        {
          "priority": 30,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "소멸을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 31,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 적 1+ + 탈태 중",
          "why": "지옥칼날을(를) 탈태 중 사용"
        },
        {
          "priority": 32,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성 + 적 1+ + 탈태 중",
          "why": "지옥 돌진을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 33,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "탈태 중 + 버프 활성 + 쿨다운 완료",
          "why": "정수 붕괴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 34,
          "skill": "복수의 후퇴",
          "skillId": "복수의 후퇴",
          "condition": "탈태 중 + 버프 활성",
          "why": "복수의 후퇴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 35,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 쿨 + 적 2+",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 36,
          "skill": "화염의 인장",
          "skillId": "화염의 인장",
          "condition": "쿨다운 완료 + 버프 활성 + 격노 40+",
          "why": "격노 생성/소모를 위한 화염의 인장 사용"
        },
        {
          "priority": 37,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "쿨다운 완료 + 버프 활성 + 탈태 쿨",
          "why": "소멸을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 38,
          "skill": "죽음의 휩쓸기",
          "skillId": "죽음의 휩쓸기",
          "condition": "쿨다운 완료",
          "why": "죽음의 휩쓸기 우선순위 3개 조건"
        },
        {
          "priority": 39,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "쿨다운 완료 + 버프 활성",
          "why": "소멸 우선순위 2개 조건"
        },
        {
          "priority": 40,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "탈태 중",
          "why": "불타는 오라을(를) 탈태 중 사용"
        },
        {
          "priority": 41,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "격노 40+ + 버프 활성 + 탈태 쿨",
          "why": "지옥칼날을(를) 탈태 중 사용"
        },
        {
          "priority": 42,
          "skill": "탈태 변신",
          "skillId": "탈태 변신",
          "condition": "탈태 중 + 버프 활성",
          "why": "탈태 변신을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 43,
          "skill": "안광",
          "skillId": "안광",
          "condition": "탈태 중 + 버프 활성 + 쿨다운 완료",
          "why": "안광을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 44,
          "skill": "안광",
          "skillId": "안광",
          "condition": "쿨다운 완료 + 버프 활성",
          "why": "디버프 유지를 위한 안광 사용"
        },
        {
          "priority": 45,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "쿨다운 완료",
          "why": "소멸 우선순위 2개 조건"
        },
        {
          "priority": 46,
          "skill": "죽음의 휩쓸기",
          "skillId": "죽음의 휩쓸기",
          "condition": "항상",
          "why": "죽음의 휩쓸기 우선순위 0개 조건"
        },
        {
          "priority": 47,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "항상",
          "why": "소멸 우선순위 0개 조건"
        },
        {
          "priority": 48,
          "skill": "악마의 이빨",
          "skillId": "악마의 이빨",
          "condition": "항상",
          "why": "악마의 이빨 우선순위 0개 조건"
        }
      ],
      "priority": [
        {
          "priority": 0,
          "skill": "혼돈 일격",
          "skillId": "혼돈 일격",
          "condition": "버프 활성 + 적 2+",
          "why": "다수 대상 상황에서 혼돈 일격 사용"
        },
        {
          "priority": 1,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 적 2+",
          "why": "다수 대상 상황에서 소멸 사용"
        },
        {
          "priority": 2,
          "skill": "혼돈 일격",
          "skillId": "혼돈 일격",
          "condition": "버프 활성 + 적 2+",
          "why": "다수 대상 상황에서 혼돈 일격 사용"
        },
        {
          "priority": 3,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 적 2+",
          "why": "다수 대상 상황에서 소멸 사용"
        },
        {
          "priority": 4,
          "skill": "파괴자의 글레이브",
          "skillId": "파괴자의 글레이브",
          "condition": "버프 활성 + 쿨다운 완료 + 적 3+",
          "why": "파괴자의 글레이브을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 5,
          "skill": "파괴자의 글레이브",
          "skillId": "파괴자의 글레이브",
          "condition": "버프 활성",
          "why": "파괴자의 글레이브 우선순위 6개 조건"
        },
        {
          "priority": 6,
          "skill": "악의의 인장",
          "skillId": "악의의 인장",
          "condition": "버프 활성 + 탈태 중",
          "why": "악의의 인장을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 7,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "버프 활성 + 탈태 중",
          "why": "불타는 오라을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 8,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 불타는 오라 사용"
        },
        {
          "priority": 9,
          "skill": "복수의 후퇴",
          "skillId": "복수의 후퇴",
          "condition": "쿨다운 완료 + 탈태 쿨 + 버프 활성",
          "why": "복수의 후퇴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 10,
          "skill": "복수의 후퇴",
          "skillId": "복수의 후퇴",
          "condition": "탈태 쿨 + 버프 활성 + 탈태 중",
          "why": "복수의 후퇴을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 11,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "적 1+ + 버프 활성 + 탈태 중",
          "why": "지옥칼날을(를) 탈태 중 사용"
        },
        {
          "priority": 12,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 쿨 + 적 1+",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용"
        },
        {
          "priority": 13,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성",
          "why": "지옥칼날 쿨다운 최적화"
        },
        {
          "priority": 14,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "내면의 불길 특성",
          "why": "다수 대상 상황에서 불타는 오라 사용"
        },
        {
          "priority": 15,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "원하는 타겟 수 초과",
          "why": "다수 대상 상황에서 불타는 오라 사용"
        },
        {
          "priority": 16,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "전투 15초 미만 남음",
          "why": "불타는 오라 쿨다운 최적화"
        },
        {
          "priority": 17,
          "skill": "안광",
          "skillId": "안광",
          "condition": "쿨다운 완료 + 적 2+ + 버프 활성",
          "why": "안광 쿨다운 최적화"
        },
        {
          "priority": 18,
          "skill": "칼춤",
          "skillId": "칼춤",
          "condition": "적 2+ + 버프 활성",
          "why": "칼춤 쿨다운 최적화"
        },
        {
          "priority": 19,
          "skill": "혼돈 일격",
          "skillId": "혼돈 일격",
          "condition": "버프 활성",
          "why": "혼돈 일격 우선순위 1개 조건"
        }
      ]
    },
    "aoe": {
      "opener": [],
      "priority": [
        {
          "priority": 0,
          "skill": "복수의 후퇴",
          "skillId": "복수의 후퇴",
          "condition": "탈태 쿨 + 버프 활성",
          "why": "복수의 후퇴을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 1,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 2,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "격노 30+ + 탈태 쿨 + 버프 활성",
          "why": "정수 붕괴을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 3,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 쿨다운 완료 + 탈태 쿨",
          "why": "소멸을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 4,
          "skill": "지옥칼날",
          "skillId": "지옥칼날",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "지옥칼날을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 5,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "지옥 돌진을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 6,
          "skill": "지옥 돌진",
          "skillId": "지옥 돌진",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "지옥 돌진을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 7,
          "skill": "불타는 오라",
          "skillId": "불타는 오라",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 불타는 오라 사용 (탈태 중)"
        },
        {
          "priority": 8,
          "skill": "소멸",
          "skillId": "소멸",
          "condition": "버프 활성 + 탈태 쿨",
          "why": "소멸을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 9,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "탈태 쿨 + 버프 활성",
          "why": "정수 붕괴을(를) 탈태 종료 전에 사용 (탈태 중)"
        },
        {
          "priority": 10,
          "skill": "정수 붕괴",
          "skillId": "정수 붕괴",
          "condition": "격노 20+ + 쿨다운 완료 + 버프 활성",
          "why": "격노 생성/소모를 위한 정수 붕괴 사용 (탈태 중)"
        },
        {
          "priority": 11,
          "skill": "죽음의 휩쓸기",
          "skillId": "죽음의 휩쓸기",
          "condition": "항상",
          "why": "죽음의 휩쓸기 우선순위 0개 조건 (탈태 중)"
        },
        {
          "priority": 12,
          "skill": "안광",
          "skillId": "안광",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 안광 사용 (탈태 중)"
        },
        {
          "priority": 13,
          "skill": "글레이브 폭풍",
          "skillId": "글레이브 폭풍",
          "condition": "버프 활성 + 격노 2+ + 적 10+",
          "why": "격노 생성/소모를 위한 글레이브 폭풍 사용 (탈태 중)"
        },
        {
          "priority": 14,
          "skill": "화염의 인장",
          "skillId": "화염의 인장",
          "condition": "버프 활성",
          "why": "디버프 유지를 위한 화염의 인장 사용 (탈태 중)"
        }
      ]
    }
  }
};

export default rotations;
