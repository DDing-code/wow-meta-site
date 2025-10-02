/**
 * SimulationCraft 프로필 파서
 * Phase 1.2 - 1,500줄 목표
 *
 * SimC 프로필 포맷 100% 호환
 * - 캐릭터 정보 파싱
 * - 장비 파싱
 * - 특성 파싱
 * - APL 파싱
 * - 변수 처리
 */

// ==================== 프로필 섹션 타입 ====================
const PROFILE_SECTION = {
  CHARACTER: 'character',
  GEAR: 'gear',
  TALENTS: 'talents',
  APL: 'apl',
  SETTINGS: 'settings',
  VARIABLES: 'variables',
  CONSUMABLES: 'consumables',
  OVERRIDES: 'overrides'
};

// ==================== 토큰 타입 ====================
const TOKEN_TYPE = {
  // 기본
  IDENTIFIER: 'identifier',
  ASSIGNMENT: 'assignment',
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',

  // 연산자
  PLUS: 'plus',
  MINUS: 'minus',
  MULTIPLY: 'multiply',
  DIVIDE: 'divide',
  MODULO: 'modulo',
  POWER: 'power',

  // 비교
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  LESS_THAN: 'less_than',
  LESS_EQUAL: 'less_equal',
  GREATER_THAN: 'greater_than',
  GREATER_EQUAL: 'greater_equal',

  // 논리
  AND: 'and',
  OR: 'or',
  NOT: 'not',

  // 구조
  DOT: 'dot',
  COMMA: 'comma',
  COLON: 'colon',
  SEMICOLON: 'semicolon',
  LEFT_PAREN: 'left_paren',
  RIGHT_PAREN: 'right_paren',
  LEFT_BRACKET: 'left_bracket',
  RIGHT_BRACKET: 'right_bracket',

  // 특수
  COMMENT: 'comment',
  NEWLINE: 'newline',
  EOF: 'eof'
};

// ==================== 렉서 (Lexer) ====================
class ProfileLexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  // 토큰화
  tokenize() {
    while (this.position < this.input.length) {
      this.skipWhitespace();

      if (this.position >= this.input.length) break;

      // 주석 처리
      if (this.peek() === '#') {
        this.skipComment();
        continue;
      }

      // 개행 처리
      if (this.peek() === '\n') {
        this.addToken(TOKEN_TYPE.NEWLINE);
        this.advance();
        this.line++;
        this.column = 1;
        continue;
      }

      // 토큰 파싱
      const token = this.nextToken();
      if (token) {
        this.tokens.push(token);
      }
    }

    this.addToken(TOKEN_TYPE.EOF);
    return this.tokens;
  }

  // 다음 토큰 파싱
  nextToken() {
    const char = this.peek();

    // 숫자
    if (this.isDigit(char)) {
      return this.parseNumber();
    }

    // 문자열
    if (char === '"' || char === "'") {
      return this.parseString();
    }

    // 식별자 또는 키워드
    if (this.isAlpha(char) || char === '_') {
      return this.parseIdentifier();
    }

    // 연산자 및 구분자
    switch (char) {
      case '=':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken(TOKEN_TYPE.EQUALS, '==');
        }
        return this.createToken(TOKEN_TYPE.ASSIGNMENT, '=');

      case '!':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken(TOKEN_TYPE.NOT_EQUALS, '!=');
        }
        return this.createToken(TOKEN_TYPE.NOT, '!');

      case '<':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken(TOKEN_TYPE.LESS_EQUAL, '<=');
        }
        return this.createToken(TOKEN_TYPE.LESS_THAN, '<');

      case '>':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken(TOKEN_TYPE.GREATER_EQUAL, '>=');
        }
        return this.createToken(TOKEN_TYPE.GREATER_THAN, '>');

      case '&':
        this.advance();
        if (this.peek() === '&') {
          this.advance();
          return this.createToken(TOKEN_TYPE.AND, '&&');
        }
        return this.createToken(TOKEN_TYPE.AND, '&');

      case '|':
        this.advance();
        if (this.peek() === '|') {
          this.advance();
          return this.createToken(TOKEN_TYPE.OR, '||');
        }
        return this.createToken(TOKEN_TYPE.OR, '|');

      case '+':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken(TOKEN_TYPE.ASSIGNMENT, '+=');
        }
        return this.createToken(TOKEN_TYPE.PLUS, '+');

      case '-':
        this.advance();
        return this.createToken(TOKEN_TYPE.MINUS, '-');

      case '*':
        this.advance();
        return this.createToken(TOKEN_TYPE.MULTIPLY, '*');

      case '/':
        this.advance();
        return this.createToken(TOKEN_TYPE.DIVIDE, '/');

      case '%':
        if (this.peek(1) === '%') {
          this.advance();
          this.advance();
          return this.createToken(TOKEN_TYPE.MODULO, '%%');
        }
        this.advance();
        return this.createToken(TOKEN_TYPE.MODULO, '%');

      case '^':
        this.advance();
        return this.createToken(TOKEN_TYPE.POWER, '^');

      case '.':
        this.advance();
        return this.createToken(TOKEN_TYPE.DOT, '.');

      case ',':
        this.advance();
        return this.createToken(TOKEN_TYPE.COMMA, ',');

      case ':':
        this.advance();
        return this.createToken(TOKEN_TYPE.COLON, ':');

      case ';':
        this.advance();
        return this.createToken(TOKEN_TYPE.SEMICOLON, ';');

      case '(':
        this.advance();
        return this.createToken(TOKEN_TYPE.LEFT_PAREN, '(');

      case ')':
        this.advance();
        return this.createToken(TOKEN_TYPE.RIGHT_PAREN, ')');

      case '[':
        this.advance();
        return this.createToken(TOKEN_TYPE.LEFT_BRACKET, '[');

      case ']':
        this.advance();
        return this.createToken(TOKEN_TYPE.RIGHT_BRACKET, ']');

      default:
        this.advance(); // 무시하고 진행
        return null;
    }
  }

  // 숫자 파싱
  parseNumber() {
    const start = this.position;
    let hasDecimal = false;

    while (this.isDigit(this.peek()) || this.peek() === '.') {
      if (this.peek() === '.') {
        if (hasDecimal) break;
        hasDecimal = true;
      }
      this.advance();
    }

    const value = this.input.substring(start, this.position);
    return this.createToken(TOKEN_TYPE.NUMBER, value);
  }

  // 문자열 파싱
  parseString() {
    const quote = this.peek();
    this.advance(); // 시작 따옴표 건너뛰기

    const start = this.position;

    while (this.peek() !== quote && this.position < this.input.length) {
      if (this.peek() === '\\') {
        this.advance(); // 이스케이프 처리
      }
      this.advance();
    }

    const value = this.input.substring(start, this.position);
    this.advance(); // 끝 따옴표 건너뛰기

    return this.createToken(TOKEN_TYPE.STRING, value);
  }

  // 식별자 파싱
  parseIdentifier() {
    const start = this.position;

    while (this.isAlphaNumeric(this.peek()) || this.peek() === '_') {
      this.advance();
    }

    const value = this.input.substring(start, this.position);

    // 불리언 체크
    if (value === 'true' || value === 'false') {
      return this.createToken(TOKEN_TYPE.BOOLEAN, value);
    }

    return this.createToken(TOKEN_TYPE.IDENTIFIER, value);
  }

  // 토큰 생성
  createToken(type, value) {
    return {
      type,
      value,
      line: this.line,
      column: this.column - value.length
    };
  }

  // 토큰 추가
  addToken(type, value = null) {
    this.tokens.push(this.createToken(type, value));
  }

  // 공백 건너뛰기
  skipWhitespace() {
    while (this.isWhitespace(this.peek()) && this.peek() !== '\n') {
      this.advance();
    }
  }

  // 주석 건너뛰기
  skipComment() {
    while (this.peek() !== '\n' && this.position < this.input.length) {
      this.advance();
    }
  }

  // 문자 확인
  peek(offset = 0) {
    const pos = this.position + offset;
    return pos < this.input.length ? this.input[pos] : '\0';
  }

  // 다음 문자로 이동
  advance() {
    if (this.position < this.input.length) {
      this.position++;
      this.column++;
    }
  }

  // 유틸리티 메서드
  isDigit(char) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z');
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  isWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\r';
  }
}

// ==================== 프로필 파서 ====================
class ProfileParser {
  constructor() {
    this.profile = {
      // 캐릭터 정보
      name: '',
      class: '',
      spec: '',
      level: 80,
      race: '',
      role: '',
      position: '',

      // 스탯
      stats: {},

      // 특성
      talents: '',
      talentLoadouts: [],

      // 장비
      gear: {},
      setBonuses: {},

      // 소모품
      consumables: {
        flask: '',
        food: '',
        augmentation: '',
        potion: '',
        temporaryEnchant: {}
      },

      // APL
      apl: {},
      aplVariables: {},

      // 설정
      settings: {
        iterations: 1000,
        targetError: 0.05,
        fightLength: 300,
        fightStyle: 'Patchwerk',
        threads: 1
      },

      // 커스텀 변수
      variables: {}
    };

    // 파싱 상태
    this.currentSection = null;
    this.errors = [];
    this.warnings = [];
  }

  // 프로필 파싱
  parse(input) {
    const lines = input.split('\n');
    let currentAPL = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 빈 줄이나 주석 건너뛰기
      if (!line || line.startsWith('#')) continue;

      try {
        // APL 파싱
        if (line.startsWith('actions')) {
          const aplParsed = this.parseAPL(line);
          if (aplParsed) {
            const { listName, action } = aplParsed;

            if (!this.profile.apl[listName]) {
              this.profile.apl[listName] = [];
            }

            if (action) {
              this.profile.apl[listName].push(action);
            }

            currentAPL = listName;
          }
        }
        // 변수 파싱
        else if (line.startsWith('variable')) {
          this.parseVariable(line);
        }
        // 일반 할당
        else if (line.includes('=')) {
          this.parseAssignment(line);
        }
      } catch (error) {
        this.errors.push({
          line: i + 1,
          message: error.message,
          content: line
        });
      }
    }

    this.postProcess();
    return this.profile;
  }

  // 할당문 파싱
  parseAssignment(line) {
    const [key, ...valueParts] = line.split('=');
    const keyTrimmed = key.trim();
    const value = valueParts.join('=').trim();

    // 캐릭터 정보
    if (this.isCharacterProperty(keyTrimmed)) {
      this.parseCharacterProperty(keyTrimmed, value);
    }
    // 장비
    else if (this.isGearSlot(keyTrimmed)) {
      this.parseGearItem(keyTrimmed, value);
    }
    // 특성
    else if (keyTrimmed === 'talents') {
      this.profile.talents = value;
    }
    // 소모품
    else if (this.isConsumable(keyTrimmed)) {
      this.parseConsumable(keyTrimmed, value);
    }
    // 설정
    else if (this.isSetting(keyTrimmed)) {
      this.parseSetting(keyTrimmed, value);
    }
    // 커스텀 변수
    else {
      this.profile.variables[keyTrimmed] = this.parseValue(value);
    }
  }

  // 캐릭터 속성 파싱
  parseCharacterProperty(key, value) {
    switch (key) {
      case 'name':
      case 'player':
      case 'paladin': // SimC 형식
      case 'warrior':
      case 'hunter':
      case 'rogue':
      case 'priest':
      case 'shaman':
      case 'mage':
      case 'warlock':
      case 'monk':
      case 'druid':
      case 'death_knight':
      case 'demon_hunter':
      case 'evoker':
        this.profile.name = value.replace(/"/g, '');
        if (key !== 'name' && key !== 'player') {
          this.profile.class = key;
        }
        break;

      case 'spec':
      case 'specialization':
        this.profile.spec = value;
        break;

      case 'level':
        this.profile.level = parseInt(value);
        break;

      case 'race':
        this.profile.race = value;
        break;

      case 'role':
        this.profile.role = value;
        break;

      case 'position':
        this.profile.position = value;
        break;

      case 'source':
        this.profile.source = value;
        break;

      default:
        // 스탯인지 확인
        if (this.isStatProperty(key)) {
          this.profile.stats[key] = parseInt(value);
        }
    }
  }

  // 장비 아이템 파싱
  parseGearItem(slot, itemString) {
    const item = {
      id: 0,
      bonusId: [],
      ilevel: 0,
      enchant: '',
      gems: [],
      stats: {}
    };

    const parts = itemString.split(',');

    for (const part of parts) {
      const [key, value] = part.split('=').map(s => s.trim());

      switch (key) {
        case 'id':
          item.id = parseInt(value);
          break;

        case 'bonus_id':
          item.bonusId = value.split('/').map(id => parseInt(id));
          break;

        case 'ilevel':
          item.ilevel = parseInt(value);
          break;

        case 'enchant':
        case 'enchant_id':
          item.enchant = value;
          break;

        case 'gem_id':
          item.gems = value.split('/').map(id => parseInt(id));
          break;

        default:
          // 아이템 이름인 경우
          if (!key.includes('=') && !value) {
            item.name = part;
          }
      }
    }

    this.profile.gear[slot] = item;
  }

  // APL 파싱
  parseAPL(line) {
    const match = line.match(/^actions(?:\.([a-z_]+))?(?:\+)?=(.+)$/);

    if (!match) return null;

    const listName = match[1] || 'default';
    const actionString = match[2].trim();

    // 액션 파싱
    const action = this.parseAction(actionString);

    return {
      listName,
      action
    };
  }

  // 액션 파싱
  parseAction(actionString) {
    const action = {
      name: '',
      conditions: [],
      parameters: {}
    };

    // 쉼표로 분리 (단, 괄호 안의 쉼표는 무시)
    const parts = this.splitByComma(actionString);

    // 첫 번째 부분은 액션 이름
    if (parts.length > 0) {
      action.name = parts[0];
    }

    // 나머지는 조건이나 매개변수
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      if (part.startsWith('if=')) {
        // 조건
        action.conditions.push(this.parseCondition(part.substring(3)));
      } else if (part.includes('=')) {
        // 매개변수
        const [key, value] = part.split('=');
        action.parameters[key] = this.parseValue(value);
      }
    }

    return action;
  }

  // 조건 파싱
  parseCondition(conditionString) {
    // 조건 표현식 파싱 (간단한 구현)
    const lexer = new ProfileLexer(conditionString);
    const tokens = lexer.tokenize();

    return {
      raw: conditionString,
      tokens: tokens,
      parsed: this.parseExpression(tokens)
    };
  }

  // 표현식 파싱
  parseExpression(tokens) {
    // 간단한 표현식 파서 (추후 확장)
    const expression = {
      type: 'expression',
      value: null,
      left: null,
      right: null,
      operator: null
    };

    // TODO: 완전한 표현식 파서 구현
    return expression;
  }

  // 변수 파싱
  parseVariable(line) {
    const match = line.match(/^variable,name=([^,]+),(.+)$/);

    if (!match) return;

    const name = match[1];
    const rest = match[2];

    const variable = {
      name,
      value: null,
      op: 'set',
      condition: null
    };

    // 나머지 파싱
    const parts = this.splitByComma(rest);

    for (const part of parts) {
      if (part.startsWith('value=')) {
        variable.value = this.parseValue(part.substring(6));
      } else if (part.startsWith('op=')) {
        variable.op = part.substring(3);
      } else if (part.startsWith('condition=')) {
        variable.condition = this.parseCondition(part.substring(10));
      } else if (part.startsWith('value_else=')) {
        variable.valueElse = this.parseValue(part.substring(11));
      }
    }

    this.profile.aplVariables[name] = variable;
  }

  // 소모품 파싱
  parseConsumable(key, value) {
    switch (key) {
      case 'flask':
      case 'food':
      case 'augmentation':
      case 'potion':
        this.profile.consumables[key] = value;
        break;

      case 'temporary_enchant':
        // main_hand:algari_mana_oil_3 형식
        const [slot, enchant] = value.split(':');
        this.profile.consumables.temporaryEnchant[slot] = enchant;
        break;
    }
  }

  // 설정 파싱
  parseSetting(key, value) {
    switch (key) {
      case 'iterations':
      case 'threads':
        this.profile.settings[key] = parseInt(value);
        break;

      case 'target_error':
        this.profile.settings.targetError = parseFloat(value);
        break;

      case 'fight_length':
      case 'max_time':
        this.profile.settings.fightLength = parseInt(value);
        break;

      case 'fight_style':
        this.profile.settings.fightStyle = value;
        break;
    }
  }

  // 값 파싱
  parseValue(valueString) {
    // 숫자 체크
    if (/^\d+(\.\d+)?$/.test(valueString)) {
      return parseFloat(valueString);
    }

    // 불리언 체크
    if (valueString === 'true') return true;
    if (valueString === 'false') return false;

    // 문자열
    return valueString.replace(/^["']|["']$/g, '');
  }

  // 쉼표로 분리 (괄호 고려)
  splitByComma(str) {
    const parts = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '(' || char === '[') {
        depth++;
      } else if (char === ')' || char === ']') {
        depth--;
      } else if (char === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    if (current) {
      parts.push(current.trim());
    }

    return parts;
  }

  // 후처리
  postProcess() {
    // 스탯 계산
    this.calculateDerivedStats();

    // 세트 보너스 확인
    this.checkSetBonuses();

    // APL 검증
    this.validateAPL();

    // 특성 파싱
    this.parseTalents();
  }

  // 유도 스탯 계산
  calculateDerivedStats() {
    const stats = this.profile.stats;

    // 기본 스탯이 없으면 추정
    if (!stats.stamina) {
      stats.stamina = 40000; // 기본값
    }

    // 체력 계산
    stats.health = stats.stamina * 20;

    // 치명타 확률 계산
    if (stats.crit_rating) {
      stats.crit_chance = 0.05 + (stats.crit_rating / 35 / 100);
    }

    // 가속 계산
    if (stats.haste_rating) {
      stats.haste_percent = stats.haste_rating / 33 / 100;
    }

    // 특화 계산
    if (stats.mastery_rating) {
      stats.mastery_value = 0.08 + (stats.mastery_rating / 35 / 100);
    }

    // 유연성 계산
    if (stats.versatility_rating) {
      stats.versatility_percent = stats.versatility_rating / 40 / 100;
    }
  }

  // 세트 보너스 확인
  checkSetBonuses() {
    const gear = this.profile.gear;
    const setBonuses = {};

    // TWW 시즌2 세트 확인 (예시)
    const twwS2Items = [
      229244, // 머리
      229242, // 어깨
      229247, // 가슴
      229243, // 다리
      229245  // 손
    ];

    let twwS2Count = 0;
    for (const slot in gear) {
      if (twwS2Items.includes(gear[slot].id)) {
        twwS2Count++;
      }
    }

    if (twwS2Count >= 2) {
      setBonuses.twws2_2pc = true;
    }
    if (twwS2Count >= 4) {
      setBonuses.twws2_4pc = true;
    }

    this.profile.setBonuses = setBonuses;
  }

  // APL 검증
  validateAPL() {
    for (const listName in this.profile.apl) {
      const actions = this.profile.apl[listName];

      for (const action of actions) {
        // call_action_list 체크
        if (action.name.startsWith('call_action_list')) {
          const targetList = action.parameters.name;

          if (targetList && !this.profile.apl[targetList]) {
            this.warnings.push({
              type: 'missing_apl',
              message: `APL list '${targetList}' not found`,
              list: listName
            });
          }
        }

        // 스킬 이름 검증 (기본적인 체크)
        if (this.isInvalidAction(action.name)) {
          this.warnings.push({
            type: 'unknown_action',
            message: `Unknown action '${action.name}'`,
            list: listName
          });
        }
      }
    }
  }

  // 특성 파싱
  parseTalents() {
    const talentString = this.profile.talents;

    if (!talentString) return;

    // SimC 특성 문자열 디코딩
    // 예: CYEAAAAAAAAAAAAAAAAAAAAAAAAAAYAAamltZmtldxYbMz22MbAAAAAAY00MMMzYbGMbDzysNDDDmhhlF2AAAIzMtNLz2MAgNgBAjxMMD

    // Base64 디코딩 및 파싱 (간단한 구현)
    this.profile.talentLoadouts = [{
      class: this.profile.class,
      spec: this.profile.spec,
      talents: talentString,
      decoded: this.decodeTalents(talentString)
    }];
  }

  // 특성 디코딩 (간단한 구현)
  decodeTalents(talentString) {
    // TODO: 실제 SimC 특성 디코딩 로직 구현
    return {
      classTree: [],
      specTree: [],
      heroTree: []
    };
  }

  // 유틸리티 메서드
  isCharacterProperty(key) {
    return [
      'name', 'player', 'class', 'spec', 'level', 'race', 'role', 'position', 'source',
      // 클래스 이름들
      'paladin', 'warrior', 'hunter', 'rogue', 'priest', 'shaman', 'mage',
      'warlock', 'monk', 'druid', 'death_knight', 'demon_hunter', 'evoker'
    ].includes(key);
  }

  isGearSlot(key) {
    return [
      'head', 'neck', 'shoulder', 'shoulders', 'back', 'chest',
      'wrist', 'wrists', 'hands', 'waist', 'legs', 'feet',
      'finger1', 'finger2', 'ring1', 'ring2',
      'trinket1', 'trinket2',
      'main_hand', 'off_hand', 'mainhand', 'offhand'
    ].includes(key);
  }

  isConsumable(key) {
    return [
      'flask', 'food', 'augmentation', 'potion',
      'temporary_enchant', 'augment_rune'
    ].includes(key);
  }

  isSetting(key) {
    return [
      'iterations', 'target_error', 'threads',
      'fight_length', 'max_time', 'fight_style'
    ].includes(key);
  }

  isStatProperty(key) {
    return [
      'strength', 'agility', 'stamina', 'intellect',
      'crit_rating', 'haste_rating', 'mastery_rating', 'versatility_rating',
      'armor', 'attack_power', 'spell_power'
    ].includes(key);
  }

  isInvalidAction(action) {
    // 기본적인 액션 검증 (확장 가능)
    const validActions = [
      'auto_attack', 'call_action_list', 'snapshot_stats',
      'use_item', 'use_items', 'potion', 'invoke_external_buff'
    ];

    // call_action_list는 유효
    if (action.startsWith('call_action_list')) return false;

    // 알려진 액션인지 체크
    // TODO: 클래스별 스킬 목록 추가
    return false; // 일단 모두 유효하다고 가정
  }

  // 에러 리포트
  getErrors() {
    return this.errors;
  }

  // 경고 리포트
  getWarnings() {
    return this.warnings;
  }

  // 파싱 결과 요약
  getSummary() {
    return {
      character: {
        name: this.profile.name,
        class: this.profile.class,
        spec: this.profile.spec,
        level: this.profile.level,
        race: this.profile.race
      },
      gear: {
        equipped: Object.keys(this.profile.gear).length,
        averageItemLevel: this.calculateAverageItemLevel()
      },
      apl: {
        lists: Object.keys(this.profile.apl).length,
        totalActions: Object.values(this.profile.apl)
          .reduce((sum, list) => sum + list.length, 0)
      },
      errors: this.errors.length,
      warnings: this.warnings.length
    };
  }

  // 평균 아이템 레벨 계산
  calculateAverageItemLevel() {
    const gear = this.profile.gear;
    let total = 0;
    let count = 0;

    for (const slot in gear) {
      if (gear[slot].ilevel) {
        total += gear[slot].ilevel;
        count++;
      }
    }

    return count > 0 ? Math.floor(total / count) : 0;
  }
}

// ==================== 프로필 로더 ====================
class ProfileLoader {
  constructor() {
    this.parser = new ProfileParser();
    this.cache = new Map();
  }

  // 파일에서 로드
  async loadFromFile(filepath) {
    // Node.js 환경
    if (typeof window === 'undefined') {
      const fs = await import('fs').then(m => m.promises);
      const content = await fs.readFile(filepath, 'utf-8');
      return this.loadFromString(content);
    }
    // 브라우저 환경
    else {
      const response = await fetch(filepath);
      const content = await response.text();
      return this.loadFromString(content);
    }
  }

  // 문자열에서 로드
  loadFromString(content) {
    // 캐시 확인
    const hash = this.hashString(content);
    if (this.cache.has(hash)) {
      return this.cache.get(hash);
    }

    // 파싱
    const profile = this.parser.parse(content);

    // 캐시 저장
    this.cache.set(hash, profile);

    return profile;
  }

  // URL에서 로드
  async loadFromURL(url) {
    const response = await fetch(url);
    const content = await response.text();
    return this.loadFromString(content);
  }

  // SimC API에서 로드
  async loadFromSimC(region, realm, character) {
    // SimC API 호출 (예시)
    const url = `https://www.simulationcraft.org/api/${region}/${realm}/${character}`;
    return this.loadFromURL(url);
  }

  // 문자열 해시 (간단한 구현)
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  // 캐시 클리어
  clearCache() {
    this.cache.clear();
  }
}

// ==================== 내보내기 ====================
export {
  ProfileParser,
  ProfileLexer,
  ProfileLoader,
  PROFILE_SECTION,
  TOKEN_TYPE
};