/**
 * SimulationCraft APL 파서
 * SimC 문법을 해석하여 실행 가능한 자바스크립트 조건으로 변환
 */

class SimCAPLParser {
  constructor() {
    // SimC 연산자 매핑
    this.operators = {
      '&': '&&',
      '|': '||',
      '!': '!',
      '=': '==',
      '!=': '!=',
      '<': '<',
      '>': '>',
      '<=': '<=',
      '>=': '>='
    };

    // SimC 함수 매핑
    this.functions = {
      'floor': 'Math.floor',
      'ceil': 'Math.ceil',
      'min': 'Math.min',
      'max': 'Math.max',
      'abs': 'Math.abs'
    };

    // 예약어
    this.keywords = [
      'actions',
      'if',
      'target_if',
      'cycle_targets',
      'max_energy',
      'interrupt',
      'use_item',
      'potion'
    ];
  }

  /**
   * APL 문자열 파싱
   */
  parse(aplString) {
    const lines = aplString.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('#')
    );

    const actions = [];
    let currentList = 'default';
    let currentAction = null;

    for (const line of lines) {
      const trimmed = line.trim();

      // 액션 리스트 정의
      if (trimmed.startsWith('actions')) {
        const match = trimmed.match(/actions\.([^=]+)/);
        if (match) {
          currentList = match[1];
        } else {
          currentList = 'default';
        }
        continue;
      }

      // 액션 파싱
      if (trimmed.includes('=')) {
        const [key, value] = trimmed.split('=').map(s => s.trim());
        
        if (key.startsWith('actions')) {
          // 액션 추가
          const actionMatch = key.match(/actions(?:\.([^+]+))?\+?="?(.+?)"?$/);
          if (actionMatch) {
            const listName = actionMatch[1] || 'default';
            const actionData = this.parseAction(value);
            
            actions.push({
              list: listName,
              ...actionData
            });
          }
        }
      }
    }

    return this.structureActions(actions);
  }

  /**
   * 개별 액션 파싱
   */
  parseAction(actionString) {
    const parts = actionString.split(',');
    const action = {
      name: parts[0],
      conditions: [],
      targetIf: null,
      cycleTargets: false,
      priority: 100
    };

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();

      if (part.startsWith('if=')) {
        action.conditions.push(this.parseCondition(part.substring(3)));
      } else if (part.startsWith('target_if=')) {
        action.targetIf = this.parseCondition(part.substring(10));
      } else if (part === 'cycle_targets=1') {
        action.cycleTargets = true;
      } else if (part.startsWith('use_item=')) {
        action.itemName = part.substring(9);
      } else if (part.startsWith('name=')) {
        action.potionName = part.substring(5);
      }
    }

    return action;
  }

  /**
   * 조건문 파싱
   */
  parseCondition(conditionString) {
    let parsed = conditionString;

    // 숫자 처리
    parsed = parsed.replace(/(\d+\.\d+|\d+)/g, '$1');

    // 변수 처리
    parsed = parsed.replace(/([a-z_]+(?:\.[a-z_]+)*)/g, (match) => {
      if (this.isFunction(match)) {
        return this.parseFunction(match);
      }
      return this.parseVariable(match);
    });

    // 연산자 변환
    Object.keys(this.operators).forEach(op => {
      const jsOp = this.operators[op];
      if (op === '&' || op === '|') {
        parsed = parsed.replace(new RegExp(`\\${op}`, 'g'), jsOp);
      } else {
        parsed = parsed.replace(new RegExp(op, 'g'), jsOp);
      }
    });

    return {
      original: conditionString,
      parsed: parsed,
      evaluate: new Function('state', `return ${parsed}`)
    };
  }

  /**
   * 변수 파싱
   */
  parseVariable(varString) {
    const parts = varString.split('.');
    const mappings = {
      // 자원
      'holy_power': 'state.resources.holyPower',
      'energy': 'state.resources.energy',
      'rage': 'state.resources.rage',
      'focus': 'state.resources.focus',
      'mana': 'state.resources.mana',
      'combo_points': 'state.resources.comboPoints',
      'soul_shards': 'state.resources.soulShards',
      'arcane_charges': 'state.resources.arcaneCharges',
      'chi': 'state.resources.chi',
      'runes': 'state.resources.runes',
      'runic_power': 'state.resources.runicPower',
      'maelstrom': 'state.resources.maelstrom',
      'insanity': 'state.resources.insanity',
      'astral_power': 'state.resources.astralPower',

      // 버프
      'buff': 'state.buffs',
      'debuff': 'state.debuffs',
      
      // 쿨다운
      'cooldown': 'state.cooldowns',
      
      // 타겟
      'target': 'state.target',
      'active_enemies': 'state.activeEnemies',
      
      // 플레이어 상태
      'health': 'state.health',
      'time_to_die': 'state.timeTodie',
      
      // 전투 상태
      'time': 'state.combatTime',
      'fight_remains': 'state.fightRemains',
      'raid_event': 'state.raidEvent',
      'moving': 'state.moving',
      'movement': 'state.movement'
    };

    // 기본 매핑
    if (mappings[parts[0]]) {
      let result = mappings[parts[0]];
      
      // 버프/디버프 처리
      if (parts[0] === 'buff' || parts[0] === 'debuff') {
        if (parts[1]) {
          result += `['${parts[1]}']`;
          if (parts[2]) {
            switch (parts[2]) {
              case 'up': result += '.active'; break;
              case 'down': result = `!${result}.active`; break;
              case 'remains': result += '.remains'; break;
              case 'stack': result += '.stacks'; break;
              case 'react': result += '.active'; break;
              default: result += `.${parts[2]}`;
            }
          }
        }
      }
      // 쿨다운 처리
      else if (parts[0] === 'cooldown') {
        if (parts[1]) {
          result += `['${parts[1]}']`;
          if (parts[2]) {
            switch (parts[2]) {
              case 'up': result += '.ready'; break;
              case 'ready': result += '.ready'; break;
              case 'remains': result += '.remains'; break;
              case 'charges': result += '.charges'; break;
              default: result += `.${parts[2]}`;
            }
          }
        }
      }
      // 타겟 처리
      else if (parts[0] === 'target') {
        for (let i = 1; i < parts.length; i++) {
          result += `.${parts[i]}`;
        }
      }
      
      return result;
    }

    // 특수 케이스
    if (varString === 'true') return 'true';
    if (varString === 'false') return 'false';

    // 기타 변수는 그대로 반환
    return `state.${varString}`;
  }

  /**
   * 함수 파싱
   */
  parseFunction(funcString) {
    const match = funcString.match(/([a-z_]+)\(([^)]+)\)/);
    if (!match) return funcString;

    const funcName = match[1];
    const args = match[2];

    if (this.functions[funcName]) {
      return `${this.functions[funcName]}(${args})`;
    }

    // 특수 함수
    switch (funcName) {
      case 'variable':
        return `state.variables['${args}']`;
      case 'set_variable':
        const [name, value] = args.split(',');
        return `(state.variables['${name}'] = ${value})`;
      default:
        return `state.${funcName}(${args})`;
    }
  }

  /**
   * 함수 확인
   */
  isFunction(str) {
    return str.includes('(') && str.includes(')');
  }

  /**
   * 액션 구조화
   */
  structureActions(actions) {
    const structured = {};

    actions.forEach(action => {
      if (!structured[action.list]) {
        structured[action.list] = [];
      }
      structured[action.list].push(action);
    });

    return structured;
  }

  /**
   * APL을 자바스크립트 함수로 컴파일
   */
  compile(apl) {
    const lists = {};

    Object.keys(apl).forEach(listName => {
      lists[listName] = apl[listName].map(action => ({
        name: action.name,
        execute: (state) => {
          // 모든 조건 확인
          if (action.conditions.length > 0) {
            const allConditionsMet = action.conditions.every(cond => {
              try {
                return cond.evaluate(state);
              } catch (e) {
                console.error(`조건 평가 오류: ${cond.original}`, e);
                return false;
              }
            });

            if (!allConditionsMet) return false;
          }

          // 타겟 선택
          if (action.targetIf) {
            // 타겟 선택 로직
            state.selectTarget(action.targetIf);
          }

          return true;
        },
        priority: action.priority
      }));
    });

    return lists;
  }

  /**
   * 게임 상태에서 다음 액션 결정
   */
  getNextAction(compiledAPL, gameState, listName = 'default') {
    const list = compiledAPL[listName];
    if (!list) return null;

    for (const action of list) {
      if (action.execute(gameState)) {
        return action.name;
      }
    }

    return null;
  }
}

export default SimCAPLParser;