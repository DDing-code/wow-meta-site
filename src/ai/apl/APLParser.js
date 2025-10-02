// SimulationCraft APL Parser
// APL(Action Priority List)은 최적화된 스킬 우선순위 시스템

class APLParser {
  constructor() {
    // APL 조건 연산자 매핑
    this.operators = {
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
      '>': (a, b) => a > b,
      '<': (a, b) => a < b,
      '=': (a, b) => a === b,
      '!=': (a, b) => a !== b,
      '&': (a, b) => a && b,
      '|': (a, b) => a || b,
      '!': (a) => !a
    };

    // APL 변수 매핑
    this.variables = {
      'rage': 'current_rage',
      'rage.max': 'max_rage',
      'rage.deficit': 'rage_deficit',
      'target.health.pct': 'target_hp_percent',
      'buff.enrage.up': 'has_enrage',
      'buff.whirlwind.up': 'has_whirlwind_buff',
      'buff.recklessness.up': 'has_recklessness',
      'cooldown.recklessness.ready': 'recklessness_ready',
      'cooldown.avatar.ready': 'avatar_ready',
      'cooldown.ravager.ready': 'ravager_ready',
      'charges.raging_blow': 'raging_blow_charges',
      'spell_targets': 'enemy_count',
      'talent.sudden_death.enabled': 'has_sudden_death',
      'buff.sudden_death.up': 'sudden_death_proc',
      'talent.slayer.enabled': 'is_slayer_build',
      'talent.thane.enabled': 'is_thane_build'
    };

    // 스킬 이름 매핑 (SIMC -> 게임)
    this.skillMapping = {
      'rampage': '격노',
      'recklessness': '무모한 희생',
      'avatar': '투신',
      'ravager': '파괴자',
      'bloodthirst': '피의 갈증',
      'raging_blow': '분노의 강타',
      'execute': '마무리 일격',
      'whirlwind': '소용돌이',
      'bladestorm': '칼날폭풍',
      'thunderous_roar': '우레 같은 포효',
      'champions_spear': '용사의 창',
      'odyn_fury': '오딘의 격노',
      'thunder_clap': '천둥벼락',
      'thunder_blast': '천둥 작렬'
    };
  }

  // APL 텍스트 파싱
  parseAPL(aplText) {
    const lines = aplText.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'));

    const actions = [];
    let currentList = 'default';
    const actionLists = {
      precombat: [],
      default: [],
      slayer_st: [],
      slayer_mt: [],
      thane_st: [],
      thane_mt: []
    };

    lines.forEach(line => {
      if (line.includes('actions.precombat')) {
        currentList = 'precombat';
      } else if (line.includes('actions.slayer_st')) {
        currentList = 'slayer_st';
      } else if (line.includes('actions.slayer_mt')) {
        currentList = 'slayer_mt';
      } else if (line.includes('actions.thane_st')) {
        currentList = 'thane_st';
      } else if (line.includes('actions.thane_mt')) {
        currentList = 'thane_mt';
      } else if (line.includes('actions=')) {
        currentList = 'default';
      }

      const action = this.parseAction(line);
      if (action) {
        actionLists[currentList].push(action);
      }
    });

    return actionLists;
  }

  // 단일 액션 파싱
  parseAction(line) {
    // 형식: actions.list+=/skill,if=condition
    const match = line.match(/actions(?:\.(\w+))?\+?=\/([^,]+)(?:,(.+))?/);

    if (!match) return null;

    const [, listName, skill, conditions] = match;

    return {
      skill: skill.replace(/_/g, ' '),
      conditions: conditions ? this.parseConditions(conditions) : null,
      priority: null // 추후 우선순위 설정
    };
  }

  // 조건문 파싱
  parseConditions(conditionString) {
    const conditions = [];

    // if= 제거
    let cleanCondition = conditionString.replace(/^if=/, '');

    // 복잡한 조건문 분해
    const parts = cleanCondition.split(/&|\|/);
    const operators = cleanCondition.match(/&|\|/g) || [];

    parts.forEach((part, index) => {
      const condition = this.parseSimpleCondition(part.trim());
      if (condition) {
        conditions.push({
          ...condition,
          connector: operators[index] || null
        });
      }
    });

    return conditions;
  }

  // 단순 조건 파싱
  parseSimpleCondition(condition) {
    // 변수 비교 (예: rage>=85)
    const compareMatch = condition.match(/([a-z._]+)(>=|<=|>|<|=|!=)(.+)/);
    if (compareMatch) {
      const [, variable, operator, value] = compareMatch;
      return {
        type: 'compare',
        variable: this.variables[variable] || variable,
        operator,
        value: this.parseValue(value)
      };
    }

    // 불린 체크 (예: buff.enrage.up)
    const boolMatch = condition.match(/^!?([a-z._]+)$/);
    if (boolMatch) {
      const [full, variable] = boolMatch;
      return {
        type: 'boolean',
        variable: this.variables[variable] || variable,
        negated: full.startsWith('!')
      };
    }

    // 함수 호출 (예: variable(trinket_1_usage))
    const funcMatch = condition.match(/(\w+)\(([^)]+)\)/);
    if (funcMatch) {
      const [, func, args] = funcMatch;
      return {
        type: 'function',
        function: func,
        arguments: args.split(',').map(a => a.trim())
      };
    }

    return null;
  }

  // 값 파싱
  parseValue(value) {
    // 숫자
    if (!isNaN(value)) {
      return parseFloat(value);
    }

    // 변수 참조
    if (this.variables[value]) {
      return { type: 'variable', name: this.variables[value] };
    }

    // 문자열
    return value;
  }

  // APL 조건 평가
  evaluateCondition(condition, gameState) {
    if (!condition) return true;

    switch (condition.type) {
      case 'compare':
        const leftValue = this.resolveValue(condition.variable, gameState);
        const rightValue = typeof condition.value === 'object'
          ? this.resolveValue(condition.value.name, gameState)
          : condition.value;
        return this.operators[condition.operator](leftValue, rightValue);

      case 'boolean':
        const boolValue = this.resolveValue(condition.variable, gameState);
        return condition.negated ? !boolValue : boolValue;

      case 'function':
        return this.evaluateFunction(condition.function, condition.arguments, gameState);

      default:
        return true;
    }
  }

  // 값 해결
  resolveValue(variable, gameState) {
    // 중첩된 속성 접근 (예: buff.enrage.up -> gameState.buffs.enrage)
    const parts = variable.split('_');
    let value = gameState;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return null;
      }
    }

    return value;
  }

  // 함수 평가
  evaluateFunction(func, args, gameState) {
    switch (func) {
      case 'variable':
        // 특수 변수 처리
        return gameState.variables?.[args[0]] || false;

      case 'active_enemies':
        return gameState.enemy_count || 1;

      default:
        return false;
    }
  }

  // APL에서 다음 스킬 결정
  getNextAction(actionList, gameState) {
    for (const action of actionList) {
      if (!action.conditions) {
        return action.skill;
      }

      let shouldExecute = true;
      let connector = null;

      for (const condition of action.conditions) {
        const result = this.evaluateCondition(condition, gameState);

        if (connector === '&') {
          shouldExecute = shouldExecute && result;
        } else if (connector === '|') {
          shouldExecute = shouldExecute || result;
        } else {
          shouldExecute = result;
        }

        connector = condition.connector;
      }

      if (shouldExecute) {
        return action.skill;
      }
    }

    return null;
  }

  // 전문화별 APL 로드
  async loadSpecializationAPL(className, specName) {
    const aplName = `${className}_${specName}`;
    const aplUrl = `https://raw.githubusercontent.com/simulationcraft/simc/thewarwithin/ActionPriorityLists/default/${aplName}.simc`;

    try {
      const response = await fetch(aplUrl);
      const aplText = await response.text();
      return this.parseAPL(aplText);
    } catch (error) {
      console.error(`APL 로드 실패: ${aplName}`, error);
      return null;
    }
  }

  // APL을 학습 데이터로 변환
  convertAPLToTrainingData(apl, className, specName) {
    const trainingData = {
      className,
      specName,
      rotations: [],
      priorities: [],
      conditions: []
    };

    // 각 액션 리스트별 처리
    Object.entries(apl).forEach(([listName, actions]) => {
      actions.forEach((action, index) => {
        // 로테이션 데이터
        trainingData.rotations.push({
          phase: listName,
          skill: action.skill,
          priority: index + 1,
          conditions: action.conditions
        });

        // 우선순위 데이터
        if (action.conditions) {
          trainingData.priorities.push({
            skill: action.skill,
            priority: index + 1,
            conditionCount: action.conditions.length
          });
        }

        // 조건 데이터
        if (action.conditions) {
          action.conditions.forEach(cond => {
            trainingData.conditions.push({
              skill: action.skill,
              conditionType: cond.type,
              variable: cond.variable,
              operator: cond.operator,
              value: cond.value
            });
          });
        }
      });
    });

    return trainingData;
  }
}

export default APLParser;