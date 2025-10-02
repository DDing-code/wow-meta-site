// APL (Action Priority List) Parser
// SimulationCraft 스타일의 우선순위 기반 액션 파서
// 조건문, 변수, 표현식을 파싱하여 최적의 로테이션 결정

const { EventEmitter } = require('events');

class APLParser extends EventEmitter {
    constructor() {
        super();

        // 파서 설정
        this.config = {
            maxDepth: 10,
            maxActions: 100,
            maxConditions: 50,
            maxVariables: 100,
            debugMode: false,
            strictMode: true
        };

        // APL 구조 저장
        this.aplStructure = {
            actions: [],
            conditions: new Map(),
            variables: new Map(),
            macros: new Map(),
            sequences: new Map(),
            priorities: []
        };

        // 토큰 타입 정의
        this.tokenTypes = {
            ACTION: 'ACTION',
            CONDITION: 'CONDITION',
            OPERATOR: 'OPERATOR',
            VARIABLE: 'VARIABLE',
            VALUE: 'VALUE',
            KEYWORD: 'KEYWORD',
            COMMENT: 'COMMENT',
            SEPARATOR: 'SEPARATOR',
            ASSIGNMENT: 'ASSIGNMENT',
            COMPARISON: 'COMPARISON',
            LOGICAL: 'LOGICAL',
            ARITHMETIC: 'ARITHMETIC',
            FUNCTION: 'FUNCTION',
            MACRO: 'MACRO'
        };

        // 키워드 정의
        this.keywords = new Set([
            'if', 'else', 'elseif', 'then', 'endif',
            'for', 'while', 'do', 'end',
            'and', 'or', 'not',
            'true', 'false', 'null',
            'action', 'condition', 'variable', 'macro',
            'sequence', 'priority', 'call',
            'target', 'self', 'pet', 'focus',
            'buff', 'debuff', 'dot', 'hot',
            'cooldown', 'resource', 'health', 'mana',
            'energy', 'rage', 'focus', 'runic_power',
            'chi', 'combo_points', 'soul_shards', 'holy_power',
            'cast', 'channel', 'gcd', 'time',
            'raid', 'party', 'group', 'enemy'
        ]);

        // 연산자 정의
        this.operators = {
            arithmetic: ['+', '-', '*', '/', '%', '^'],
            comparison: ['==', '!=', '<', '>', '<=', '>='],
            logical: ['&&', '||', '!', 'and', 'or', 'not'],
            assignment: ['=', '+=', '-=', '*=', '/='],
            special: ['.', ',', ';', ':', '(', ')', '[', ']', '{', '}']
        };

        // 함수 정의
        this.functions = new Map([
            ['min', { args: 2, eval: (a, b) => Math.min(a, b) }],
            ['max', { args: 2, eval: (a, b) => Math.max(a, b) }],
            ['floor', { args: 1, eval: (a) => Math.floor(a) }],
            ['ceil', { args: 1, eval: (a) => Math.ceil(a) }],
            ['round', { args: 1, eval: (a) => Math.round(a) }],
            ['abs', { args: 1, eval: (a) => Math.abs(a) }],
            ['random', { args: 0, eval: () => Math.random() }],
            ['time_to_die', { args: 0, eval: () => this.getTimeToDie() }],
            ['time_to_max_energy', { args: 0, eval: () => this.getTimeToMaxEnergy() }],
            ['spell_targets', { args: 1, eval: (spell) => this.getSpellTargets(spell) }],
            ['active_enemies', { args: 0, eval: () => this.getActiveEnemies() }],
            ['combo_points', { args: 0, eval: () => this.getComboPoints() }],
            ['resource', { args: 1, eval: (type) => this.getResource(type) }],
            ['buff_remains', { args: 1, eval: (buff) => this.getBuffRemains(buff) }],
            ['debuff_remains', { args: 1, eval: (debuff) => this.getDebuffRemains(debuff) }],
            ['cooldown_remains', { args: 1, eval: (spell) => this.getCooldownRemains(spell) }],
            ['charges', { args: 1, eval: (spell) => this.getCharges(spell) }],
            ['stack', { args: 1, eval: (buff) => this.getStacks(buff) }],
            ['refreshable', { args: 1, eval: (dot) => this.isRefreshable(dot) }],
            ['pandemic', { args: 1, eval: (dot) => this.inPandemic(dot) }]
        ]);

        // 변수 스토리지
        this.variables = new Map();

        // 실행 컨텍스트
        this.context = {
            player: null,
            target: null,
            environment: null,
            combat: false,
            time: 0,
            gcd: 1.5,
            lastAction: null,
            actionHistory: [],
            currentSequence: null,
            sequenceIndex: 0
        };

        // 파싱 상태
        this.parsingState = {
            currentLine: 0,
            currentColumn: 0,
            currentToken: null,
            tokens: [],
            errors: [],
            warnings: []
        };

        // 실행 상태
        this.executionState = {
            running: false,
            paused: false,
            step: 0,
            maxSteps: 1000,
            breakpoints: new Set(),
            watchList: new Set()
        };

        // 성능 메트릭
        this.metrics = {
            parseTime: 0,
            compilationTime: 0,
            executionTime: 0,
            totalActions: 0,
            conditionsEvaluated: 0,
            variablesAccessed: 0,
            cacheHits: 0,
            cacheMisses: 0
        };

        // 캐시 시스템
        this.cache = {
            conditions: new Map(),
            expressions: new Map(),
            results: new Map(),
            ttl: 100 // 밀리초
        };

        this.initializeBuiltins();
        this.setupErrorHandling();
    }

    initializeBuiltins() {
        // 내장 액션 정의
        this.builtinActions = new Map([
            ['wait', { execute: (time) => this.wait(time) }],
            ['pool', { execute: (resource, amount) => this.poolResource(resource, amount) }],
            ['cancel_buff', { execute: (buff) => this.cancelBuff(buff) }],
            ['use_item', { execute: (item) => this.useItem(item) }],
            ['call_action_list', { execute: (list) => this.callActionList(list) }],
            ['run_action_list', { execute: (list) => this.runActionList(list) }],
            ['strict_sequence', { execute: (actions) => this.strictSequence(actions) }],
            ['variable', { execute: (name, value) => this.setVariable(name, value) }],
            ['cycling_variable', { execute: (name, values) => this.cycleVariable(name, values) }],
            ['snapshot_stats', { execute: () => this.snapshotStats() }],
            ['start_burn_phase', { execute: () => this.startBurnPhase() }],
            ['stop_burn_phase', { execute: () => this.stopBurnPhase() }]
        ]);

        // 내장 조건 정의
        this.builtinConditions = new Map([
            ['in_combat', () => this.context.combat],
            ['out_of_combat', () => !this.context.combat],
            ['moving', () => this.isMoving()],
            ['casting', () => this.isCasting()],
            ['channeling', () => this.isChanneling()],
            ['in_gcd', () => this.inGCD()],
            ['burn_phase', () => this.inBurnPhase()],
            ['conserve_phase', () => this.inConservePhase()],
            ['execute_phase', () => this.inExecutePhase()],
            ['opener_sequence', () => this.inOpenerSequence()],
            ['bloodlust', () => this.hasBloodlust()],
            ['potion', () => this.hasPotionActive()],
            ['racial', () => this.hasRacialActive()],
            ['trinket', () => this.hasTrinketActive()]
        ]);

        // 내장 매크로 정의
        this.builtinMacros = new Map([
            ['st', 'action_list=single_target'],
            ['aoe', 'action_list=aoe'],
            ['cleave', 'action_list=cleave'],
            ['cds', 'action_list=cooldowns'],
            ['movement', 'action_list=movement'],
            ['defensives', 'action_list=defensives'],
            ['interrupt', 'action_list=interrupts'],
            ['opener', 'action_list=opener']
        ]);
    }

    setupErrorHandling() {
        // 에러 핸들러
        this.on('error', (error) => {
            this.parsingState.errors.push({
                line: this.parsingState.currentLine,
                column: this.parsingState.currentColumn,
                message: error.message,
                type: error.type || 'ERROR',
                timestamp: Date.now()
            });

            if (this.config.debugMode) {
                console.error(`APL Error at ${this.parsingState.currentLine}:${this.parsingState.currentColumn}: ${error.message}`);
            }
        });

        // 경고 핸들러
        this.on('warning', (warning) => {
            this.parsingState.warnings.push({
                line: this.parsingState.currentLine,
                column: this.parsingState.currentColumn,
                message: warning.message,
                type: warning.type || 'WARNING',
                timestamp: Date.now()
            });

            if (this.config.debugMode) {
                console.warn(`APL Warning at ${this.parsingState.currentLine}:${this.parsingState.currentColumn}: ${warning.message}`);
            }
        });
    }

    // 메인 파싱 함수
    parse(aplString) {
        const startTime = performance.now();
        this.resetParsingState();

        try {
            // 토큰화
            const tokens = this.tokenize(aplString);
            this.parsingState.tokens = tokens;

            // 구문 분석
            const ast = this.buildAST(tokens);

            // 의미 분석
            this.semanticAnalysis(ast);

            // 최적화
            const optimizedAST = this.optimize(ast);

            // 컴파일
            const compiled = this.compile(optimizedAST);

            this.metrics.parseTime = performance.now() - startTime;

            return {
                success: true,
                ast: optimizedAST,
                compiled: compiled,
                errors: this.parsingState.errors,
                warnings: this.parsingState.warnings,
                metrics: this.metrics
            };
        } catch (error) {
            this.emit('error', error);
            return {
                success: false,
                errors: this.parsingState.errors,
                warnings: this.parsingState.warnings
            };
        }
    }

    // 토큰화
    tokenize(input) {
        const tokens = [];
        const lines = input.split('\n');

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];
            this.parsingState.currentLine = lineNum + 1;
            this.parsingState.currentColumn = 0;

            // 주석 제거
            const cleanLine = this.removeComments(line);
            if (cleanLine.trim() === '') continue;

            // 토큰 추출
            const lineTokens = this.extractTokens(cleanLine);
            tokens.push(...lineTokens);
        }

        return tokens;
    }

    removeComments(line) {
        // # 스타일 주석
        const hashIndex = line.indexOf('#');
        if (hashIndex !== -1) {
            return line.substring(0, hashIndex);
        }

        // // 스타일 주석
        const slashIndex = line.indexOf('//');
        if (slashIndex !== -1) {
            return line.substring(0, slashIndex);
        }

        return line;
    }

    extractTokens(line) {
        const tokens = [];
        let current = 0;

        while (current < line.length) {
            this.parsingState.currentColumn = current;

            // 공백 스킵
            if (/\s/.test(line[current])) {
                current++;
                continue;
            }

            // 문자열
            if (line[current] === '"' || line[current] === "'") {
                const quote = line[current];
                let value = '';
                current++;

                while (current < line.length && line[current] !== quote) {
                    if (line[current] === '\\' && current + 1 < line.length) {
                        current++;
                        value += this.escapeCharacter(line[current]);
                    } else {
                        value += line[current];
                    }
                    current++;
                }

                if (current >= line.length) {
                    this.emit('error', { message: '문자열이 닫히지 않음' });
                }

                tokens.push({
                    type: this.tokenTypes.VALUE,
                    value: value,
                    dataType: 'string',
                    line: this.parsingState.currentLine,
                    column: this.parsingState.currentColumn
                });
                current++;
                continue;
            }

            // 숫자
            if (/\d/.test(line[current])) {
                let value = '';

                while (current < line.length && /[\d.]/.test(line[current])) {
                    value += line[current];
                    current++;
                }

                tokens.push({
                    type: this.tokenTypes.VALUE,
                    value: parseFloat(value),
                    dataType: 'number',
                    line: this.parsingState.currentLine,
                    column: this.parsingState.currentColumn
                });
                continue;
            }

            // 연산자
            const operator = this.extractOperator(line, current);
            if (operator) {
                tokens.push({
                    type: this.getOperatorType(operator),
                    value: operator,
                    line: this.parsingState.currentLine,
                    column: this.parsingState.currentColumn
                });
                current += operator.length;
                continue;
            }

            // 식별자 (키워드, 변수, 함수)
            if (/[a-zA-Z_]/.test(line[current])) {
                let value = '';

                while (current < line.length && /[a-zA-Z0-9_.]/.test(line[current])) {
                    value += line[current];
                    current++;
                }

                const tokenType = this.getIdentifierType(value);
                tokens.push({
                    type: tokenType,
                    value: value,
                    line: this.parsingState.currentLine,
                    column: this.parsingState.currentColumn
                });
                continue;
            }

            // 특수 문자
            if (this.isSpecialCharacter(line[current])) {
                tokens.push({
                    type: this.tokenTypes.SEPARATOR,
                    value: line[current],
                    line: this.parsingState.currentLine,
                    column: this.parsingState.currentColumn
                });
                current++;
                continue;
            }

            // 인식할 수 없는 문자
            this.emit('error', { message: `인식할 수 없는 문자: ${line[current]}` });
            current++;
        }

        return tokens;
    }

    escapeCharacter(char) {
        const escapeMap = {
            'n': '\n',
            't': '\t',
            'r': '\r',
            '\\': '\\',
            '"': '"',
            "'": "'"
        };
        return escapeMap[char] || char;
    }

    extractOperator(line, start) {
        // 2글자 연산자 먼저 체크
        if (start + 1 < line.length) {
            const twoChar = line.substring(start, start + 2);
            if (this.isOperator(twoChar)) {
                return twoChar;
            }
        }

        // 1글자 연산자
        if (this.isOperator(line[start])) {
            return line[start];
        }

        return null;
    }

    isOperator(str) {
        for (const category of Object.values(this.operators)) {
            if (category.includes(str)) {
                return true;
            }
        }
        return false;
    }

    getOperatorType(operator) {
        if (this.operators.arithmetic.includes(operator)) return this.tokenTypes.ARITHMETIC;
        if (this.operators.comparison.includes(operator)) return this.tokenTypes.COMPARISON;
        if (this.operators.logical.includes(operator)) return this.tokenTypes.LOGICAL;
        if (this.operators.assignment.includes(operator)) return this.tokenTypes.ASSIGNMENT;
        return this.tokenTypes.OPERATOR;
    }

    getIdentifierType(identifier) {
        if (this.keywords.has(identifier)) return this.tokenTypes.KEYWORD;
        if (this.functions.has(identifier)) return this.tokenTypes.FUNCTION;
        if (identifier.startsWith('$')) return this.tokenTypes.VARIABLE;
        if (identifier.startsWith('@')) return this.tokenTypes.MACRO;
        return this.tokenTypes.ACTION;
    }

    isSpecialCharacter(char) {
        return '()[]{},.;:'.includes(char);
    }

    // AST 구축
    buildAST(tokens) {
        const ast = {
            type: 'Program',
            body: [],
            metadata: {
                version: '1.0',
                timestamp: Date.now()
            }
        };

        let current = 0;

        while (current < tokens.length) {
            const node = this.parseStatement(tokens, current);
            if (node) {
                ast.body.push(node.node);
                current = node.nextIndex;
            } else {
                current++;
            }
        }

        return ast;
    }

    parseStatement(tokens, index) {
        if (index >= tokens.length) return null;

        const token = tokens[index];

        // actions 블록
        if (token.value === 'actions') {
            return this.parseActionsBlock(tokens, index);
        }

        // action 정의
        if (token.value === 'action') {
            return this.parseAction(tokens, index);
        }

        // 조건문
        if (token.value === 'if') {
            return this.parseIfStatement(tokens, index);
        }

        // 반복문
        if (token.value === 'for' || token.value === 'while') {
            return this.parseLoop(tokens, index);
        }

        // 변수 할당
        if (token.type === this.tokenTypes.VARIABLE) {
            return this.parseVariableAssignment(tokens, index);
        }

        // 함수 호출
        if (token.type === this.tokenTypes.FUNCTION) {
            return this.parseFunctionCall(tokens, index);
        }

        // 액션 호출
        if (token.type === this.tokenTypes.ACTION) {
            return this.parseActionCall(tokens, index);
        }

        return null;
    }

    parseActionsBlock(tokens, index) {
        const node = {
            type: 'ActionsBlock',
            name: null,
            priority: 0,
            actions: []
        };

        let current = index + 1;

        // actions 이름 파싱
        if (current < tokens.length && tokens[current].value === '=') {
            current++;
            if (current < tokens.length) {
                node.name = tokens[current].value;
                current++;
            }
        }

        // 액션 리스트 파싱
        while (current < tokens.length) {
            // 새로운 actions 블록이나 다른 최상위 구문 만나면 종료
            if (tokens[current].value === 'actions' ||
                tokens[current].value === 'end') {
                break;
            }

            const action = this.parseActionLine(tokens, current);
            if (action) {
                node.actions.push(action.node);
                current = action.nextIndex;
            } else {
                current++;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseActionLine(tokens, index) {
        const node = {
            type: 'ActionLine',
            priority: null,
            action: null,
            condition: null,
            metadata: {}
        };

        let current = index;

        // 우선순위 번호 체크
        if (tokens[current].type === this.tokenTypes.VALUE &&
            typeof tokens[current].value === 'number') {
            node.priority = tokens[current].value;
            current++;

            // '.' 또는 ')' 스킵
            if (current < tokens.length &&
                (tokens[current].value === '.' || tokens[current].value === ')')) {
                current++;
            }
        }

        // 액션 파싱
        if (current < tokens.length) {
            const actionResult = this.parseActionCall(tokens, current);
            if (actionResult) {
                node.action = actionResult.node;
                current = actionResult.nextIndex;
            }
        }

        // 조건 파싱 (if 키워드)
        if (current < tokens.length && tokens[current].value === 'if') {
            current++;
            const conditionResult = this.parseCondition(tokens, current);
            if (conditionResult) {
                node.condition = conditionResult.node;
                current = conditionResult.nextIndex;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseAction(tokens, index) {
        const node = {
            type: 'ActionDefinition',
            name: null,
            parameters: [],
            body: null
        };

        let current = index + 1;

        // 액션 이름
        if (current < tokens.length) {
            node.name = tokens[current].value;
            current++;
        }

        // 파라미터 파싱
        if (current < tokens.length && tokens[current].value === '(') {
            current++;
            const params = this.parseParameterList(tokens, current);
            node.parameters = params.parameters;
            current = params.nextIndex;
        }

        // 액션 바디
        if (current < tokens.length && tokens[current].value === '{') {
            const body = this.parseBlock(tokens, current);
            node.body = body.node;
            current = body.nextIndex;
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseIfStatement(tokens, index) {
        const node = {
            type: 'IfStatement',
            condition: null,
            then: null,
            else: null
        };

        let current = index + 1;

        // 조건 파싱
        const condition = this.parseCondition(tokens, current);
        if (condition) {
            node.condition = condition.node;
            current = condition.nextIndex;
        }

        // then 절
        if (current < tokens.length && tokens[current].value === 'then') {
            current++;
            const thenBlock = this.parseBlock(tokens, current);
            node.then = thenBlock.node;
            current = thenBlock.nextIndex;
        }

        // else 절
        if (current < tokens.length && tokens[current].value === 'else') {
            current++;
            if (tokens[current].value === 'if') {
                // elseif
                const elseIf = this.parseIfStatement(tokens, current);
                node.else = elseIf.node;
                current = elseIf.nextIndex;
            } else {
                const elseBlock = this.parseBlock(tokens, current);
                node.else = elseBlock.node;
                current = elseBlock.nextIndex;
            }
        }

        // endif
        if (current < tokens.length && tokens[current].value === 'endif') {
            current++;
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseLoop(tokens, index) {
        const loopType = tokens[index].value;
        const node = {
            type: loopType === 'for' ? 'ForLoop' : 'WhileLoop',
            initialization: null,
            condition: null,
            update: null,
            body: null
        };

        let current = index + 1;

        if (loopType === 'for') {
            // for 루프 파싱
            if (current < tokens.length && tokens[current].value === '(') {
                current++;

                // 초기화
                const init = this.parseExpression(tokens, current);
                if (init) {
                    node.initialization = init.node;
                    current = init.nextIndex;
                }

                if (tokens[current].value === ';') current++;

                // 조건
                const condition = this.parseCondition(tokens, current);
                if (condition) {
                    node.condition = condition.node;
                    current = condition.nextIndex;
                }

                if (tokens[current].value === ';') current++;

                // 업데이트
                const update = this.parseExpression(tokens, current);
                if (update) {
                    node.update = update.node;
                    current = update.nextIndex;
                }

                if (tokens[current].value === ')') current++;
            }
        } else {
            // while 루프 조건
            const condition = this.parseCondition(tokens, current);
            if (condition) {
                node.condition = condition.node;
                current = condition.nextIndex;
            }
        }

        // 루프 바디
        if (current < tokens.length && tokens[current].value === 'do') {
            current++;
            const body = this.parseBlock(tokens, current);
            node.body = body.node;
            current = body.nextIndex;
        }

        // end 키워드
        if (current < tokens.length && tokens[current].value === 'end') {
            current++;
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseCondition(tokens, index) {
        return this.parseLogicalExpression(tokens, index);
    }

    parseLogicalExpression(tokens, index) {
        let left = this.parseComparisonExpression(tokens, index);
        if (!left) return null;

        let current = left.nextIndex;

        while (current < tokens.length) {
            const token = tokens[current];

            if (token.type === this.tokenTypes.LOGICAL &&
                (token.value === '&&' || token.value === '||' ||
                 token.value === 'and' || token.value === 'or')) {
                current++;
                const right = this.parseComparisonExpression(tokens, current);

                if (!right) {
                    this.emit('error', { message: '논리 연산자 뒤에 표현식이 없음' });
                    break;
                }

                left = {
                    node: {
                        type: 'LogicalExpression',
                        operator: token.value,
                        left: left.node,
                        right: right.node
                    },
                    nextIndex: right.nextIndex
                };
                current = right.nextIndex;
            } else {
                break;
            }
        }

        return left;
    }

    parseComparisonExpression(tokens, index) {
        let left = this.parseArithmeticExpression(tokens, index);
        if (!left) return null;

        let current = left.nextIndex;

        if (current < tokens.length && tokens[current].type === this.tokenTypes.COMPARISON) {
            const operator = tokens[current].value;
            current++;

            const right = this.parseArithmeticExpression(tokens, current);
            if (!right) {
                this.emit('error', { message: '비교 연산자 뒤에 표현식이 없음' });
                return left;
            }

            return {
                node: {
                    type: 'ComparisonExpression',
                    operator: operator,
                    left: left.node,
                    right: right.node
                },
                nextIndex: right.nextIndex
            };
        }

        return left;
    }

    parseArithmeticExpression(tokens, index) {
        let left = this.parseTerm(tokens, index);
        if (!left) return null;

        let current = left.nextIndex;

        while (current < tokens.length) {
            const token = tokens[current];

            if (token.type === this.tokenTypes.ARITHMETIC &&
                (token.value === '+' || token.value === '-')) {
                current++;
                const right = this.parseTerm(tokens, current);

                if (!right) {
                    this.emit('error', { message: '산술 연산자 뒤에 표현식이 없음' });
                    break;
                }

                left = {
                    node: {
                        type: 'ArithmeticExpression',
                        operator: token.value,
                        left: left.node,
                        right: right.node
                    },
                    nextIndex: right.nextIndex
                };
                current = right.nextIndex;
            } else {
                break;
            }
        }

        return left;
    }

    parseTerm(tokens, index) {
        let left = this.parseFactor(tokens, index);
        if (!left) return null;

        let current = left.nextIndex;

        while (current < tokens.length) {
            const token = tokens[current];

            if (token.type === this.tokenTypes.ARITHMETIC &&
                (token.value === '*' || token.value === '/' || token.value === '%')) {
                current++;
                const right = this.parseFactor(tokens, current);

                if (!right) {
                    this.emit('error', { message: '산술 연산자 뒤에 표현식이 없음' });
                    break;
                }

                left = {
                    node: {
                        type: 'ArithmeticExpression',
                        operator: token.value,
                        left: left.node,
                        right: right.node
                    },
                    nextIndex: right.nextIndex
                };
                current = right.nextIndex;
            } else {
                break;
            }
        }

        return left;
    }

    parseFactor(tokens, index) {
        if (index >= tokens.length) return null;

        const token = tokens[index];

        // 괄호 표현식
        if (token.value === '(') {
            const expr = this.parseExpression(tokens, index + 1);
            if (expr && expr.nextIndex < tokens.length &&
                tokens[expr.nextIndex].value === ')') {
                return {
                    node: expr.node,
                    nextIndex: expr.nextIndex + 1
                };
            }
        }

        // 단항 연산자
        if (token.type === this.tokenTypes.LOGICAL && token.value === '!') {
            const expr = this.parseFactor(tokens, index + 1);
            if (expr) {
                return {
                    node: {
                        type: 'UnaryExpression',
                        operator: '!',
                        argument: expr.node
                    },
                    nextIndex: expr.nextIndex
                };
            }
        }

        // 함수 호출
        if (token.type === this.tokenTypes.FUNCTION) {
            return this.parseFunctionCall(tokens, index);
        }

        // 변수
        if (token.type === this.tokenTypes.VARIABLE) {
            return {
                node: {
                    type: 'Variable',
                    name: token.value
                },
                nextIndex: index + 1
            };
        }

        // 리터럴 값
        if (token.type === this.tokenTypes.VALUE) {
            return {
                node: {
                    type: 'Literal',
                    value: token.value,
                    dataType: token.dataType
                },
                nextIndex: index + 1
            };
        }

        // 속성 접근
        if (token.type === this.tokenTypes.ACTION && index + 1 < tokens.length &&
            tokens[index + 1].value === '.') {
            return this.parsePropertyAccess(tokens, index);
        }

        return null;
    }

    parseExpression(tokens, index) {
        // 할당 표현식 체크
        if (index < tokens.length && tokens[index].type === this.tokenTypes.VARIABLE) {
            const nextIndex = index + 1;
            if (nextIndex < tokens.length &&
                tokens[nextIndex].type === this.tokenTypes.ASSIGNMENT) {
                return this.parseVariableAssignment(tokens, index);
            }
        }

        return this.parseLogicalExpression(tokens, index);
    }

    parseVariableAssignment(tokens, index) {
        const node = {
            type: 'VariableAssignment',
            variable: tokens[index].value,
            operator: null,
            value: null
        };

        let current = index + 1;

        if (current < tokens.length && tokens[current].type === this.tokenTypes.ASSIGNMENT) {
            node.operator = tokens[current].value;
            current++;

            const value = this.parseExpression(tokens, current);
            if (value) {
                node.value = value.node;
                current = value.nextIndex;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseFunctionCall(tokens, index) {
        const node = {
            type: 'FunctionCall',
            name: tokens[index].value,
            arguments: []
        };

        let current = index + 1;

        if (current < tokens.length && tokens[current].value === '(') {
            current++;
            const args = this.parseArgumentList(tokens, current);
            node.arguments = args.arguments;
            current = args.nextIndex;

            if (current < tokens.length && tokens[current].value === ')') {
                current++;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseActionCall(tokens, index) {
        const node = {
            type: 'ActionCall',
            name: tokens[index].value,
            parameters: new Map()
        };

        let current = index + 1;

        // 파라미터 파싱
        while (current < tokens.length) {
            if (tokens[current].value === ',' ||
                tokens[current].value === ';' ||
                tokens[current].value === 'if') {
                break;
            }

            // 파라미터 이름=값 형식
            if (current + 2 < tokens.length &&
                tokens[current + 1].value === '=') {
                const paramName = tokens[current].value;
                current += 2;

                const value = this.parseValue(tokens, current);
                if (value) {
                    node.parameters.set(paramName, value.node);
                    current = value.nextIndex;
                }
            } else {
                current++;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parsePropertyAccess(tokens, index) {
        const node = {
            type: 'PropertyAccess',
            object: tokens[index].value,
            property: null
        };

        let current = index + 1;

        if (current < tokens.length && tokens[current].value === '.') {
            current++;
            if (current < tokens.length) {
                node.property = tokens[current].value;
                current++;
            }
        }

        return {
            node: node,
            nextIndex: current
        };
    }

    parseValue(tokens, index) {
        if (index >= tokens.length) return null;

        const token = tokens[index];

        if (token.type === this.tokenTypes.VALUE) {
            return {
                node: {
                    type: 'Literal',
                    value: token.value,
                    dataType: token.dataType
                },
                nextIndex: index + 1
            };
        }

        if (token.type === this.tokenTypes.VARIABLE) {
            return {
                node: {
                    type: 'Variable',
                    name: token.value
                },
                nextIndex: index + 1
            };
        }

        // 표현식일 수도 있음
        return this.parseExpression(tokens, index);
    }

    parseArgumentList(tokens, index) {
        const args = [];
        let current = index;

        while (current < tokens.length && tokens[current].value !== ')') {
            const arg = this.parseExpression(tokens, current);
            if (arg) {
                args.push(arg.node);
                current = arg.nextIndex;
            }

            if (current < tokens.length && tokens[current].value === ',') {
                current++;
            } else if (tokens[current].value !== ')') {
                break;
            }
        }

        return {
            arguments: args,
            nextIndex: current
        };
    }

    parseParameterList(tokens, index) {
        const params = [];
        let current = index;

        while (current < tokens.length && tokens[current].value !== ')') {
            if (tokens[current].type === this.tokenTypes.ACTION ||
                tokens[current].type === this.tokenTypes.VARIABLE) {
                params.push(tokens[current].value);
                current++;
            }

            if (current < tokens.length && tokens[current].value === ',') {
                current++;
            } else if (tokens[current].value !== ')') {
                break;
            }
        }

        if (current < tokens.length && tokens[current].value === ')') {
            current++;
        }

        return {
            parameters: params,
            nextIndex: current
        };
    }

    parseBlock(tokens, index) {
        const statements = [];
        let current = index;

        // { } 블록
        if (current < tokens.length && tokens[current].value === '{') {
            current++;

            while (current < tokens.length && tokens[current].value !== '}') {
                const stmt = this.parseStatement(tokens, current);
                if (stmt) {
                    statements.push(stmt.node);
                    current = stmt.nextIndex;
                } else {
                    current++;
                }
            }

            if (current < tokens.length && tokens[current].value === '}') {
                current++;
            }
        } else {
            // 단일 문장
            const stmt = this.parseStatement(tokens, current);
            if (stmt) {
                statements.push(stmt.node);
                current = stmt.nextIndex;
            }
        }

        return {
            node: {
                type: 'Block',
                statements: statements
            },
            nextIndex: current
        };
    }

    // 의미 분석
    semanticAnalysis(ast) {
        this.checkUndefinedVariables(ast);
        this.checkUnusedVariables(ast);
        this.checkInfiniteLoops(ast);
        this.checkDeadCode(ast);
        this.validateActionCalls(ast);
        this.validateConditions(ast);
    }

    checkUndefinedVariables(node) {
        if (!node) return;

        if (node.type === 'Variable') {
            if (!this.variables.has(node.name) &&
                !this.isBuiltinVariable(node.name)) {
                this.emit('warning', {
                    message: `정의되지 않은 변수: ${node.name}`,
                    type: 'UNDEFINED_VARIABLE'
                });
            }
        }

        // 재귀적으로 자식 노드 체크
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => this.checkUndefinedVariables(child));
                } else {
                    this.checkUndefinedVariables(node[key]);
                }
            }
        }
    }

    checkUnusedVariables(ast) {
        const declaredVars = new Set();
        const usedVars = new Set();

        this.collectVariables(ast, declaredVars, usedVars);

        for (const varName of declaredVars) {
            if (!usedVars.has(varName)) {
                this.emit('warning', {
                    message: `사용되지 않는 변수: ${varName}`,
                    type: 'UNUSED_VARIABLE'
                });
            }
        }
    }

    collectVariables(node, declared, used) {
        if (!node) return;

        if (node.type === 'VariableAssignment') {
            declared.add(node.variable);
        } else if (node.type === 'Variable') {
            used.add(node.name);
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => this.collectVariables(child, declared, used));
                } else {
                    this.collectVariables(node[key], declared, used);
                }
            }
        }
    }

    checkInfiniteLoops(node) {
        if (!node) return;

        if (node.type === 'WhileLoop') {
            if (!this.hasBreakCondition(node.body)) {
                this.emit('warning', {
                    message: '무한 루프 가능성',
                    type: 'INFINITE_LOOP'
                });
            }
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => this.checkInfiniteLoops(child));
                } else {
                    this.checkInfiniteLoops(node[key]);
                }
            }
        }
    }

    hasBreakCondition(node) {
        if (!node) return false;

        if (node.type === 'Break' || node.type === 'Return') {
            return true;
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    for (const child of node[key]) {
                        if (this.hasBreakCondition(child)) return true;
                    }
                } else {
                    if (this.hasBreakCondition(node[key])) return true;
                }
            }
        }

        return false;
    }

    checkDeadCode(node) {
        // 도달할 수 없는 코드 체크
        // 구현 생략 (복잡도 관리)
    }

    validateActionCalls(node) {
        if (!node) return;

        if (node.type === 'ActionCall') {
            if (!this.isValidAction(node.name)) {
                this.emit('error', {
                    message: `알 수 없는 액션: ${node.name}`,
                    type: 'UNKNOWN_ACTION'
                });
            }
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => this.validateActionCalls(child));
                } else {
                    this.validateActionCalls(node[key]);
                }
            }
        }
    }

    validateConditions(node) {
        if (!node) return;

        if (node.type === 'ComparisonExpression') {
            // 타입 호환성 체크
            const leftType = this.getExpressionType(node.left);
            const rightType = this.getExpressionType(node.right);

            if (leftType && rightType && leftType !== rightType) {
                this.emit('warning', {
                    message: '타입 불일치 비교',
                    type: 'TYPE_MISMATCH'
                });
            }
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => this.validateConditions(child));
                } else {
                    this.validateConditions(node[key]);
                }
            }
        }
    }

    getExpressionType(node) {
        if (!node) return null;

        if (node.type === 'Literal') {
            return node.dataType;
        }

        if (node.type === 'Variable') {
            const varInfo = this.variables.get(node.name);
            return varInfo ? varInfo.type : null;
        }

        if (node.type === 'FunctionCall') {
            const func = this.functions.get(node.name);
            return func ? func.returnType : null;
        }

        return null;
    }

    // 최적화
    optimize(ast) {
        const optimized = this.constantFolding(ast);
        const deadCodeEliminated = this.eliminateDeadCode(optimized);
        const simplified = this.simplifyExpressions(deadCodeEliminated);
        return simplified;
    }

    constantFolding(node) {
        if (!node) return node;

        // 상수 표현식 계산
        if (node.type === 'ArithmeticExpression') {
            const left = this.constantFolding(node.left);
            const right = this.constantFolding(node.right);

            if (left.type === 'Literal' && right.type === 'Literal' &&
                left.dataType === 'number' && right.dataType === 'number') {
                let value;
                switch (node.operator) {
                    case '+': value = left.value + right.value; break;
                    case '-': value = left.value - right.value; break;
                    case '*': value = left.value * right.value; break;
                    case '/': value = left.value / right.value; break;
                    case '%': value = left.value % right.value; break;
                    default: return { ...node, left, right };
                }

                return {
                    type: 'Literal',
                    value: value,
                    dataType: 'number'
                };
            }

            return { ...node, left, right };
        }

        // 재귀적으로 최적화
        const optimized = {};
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    optimized[key] = node[key].map(child => this.constantFolding(child));
                } else {
                    optimized[key] = this.constantFolding(node[key]);
                }
            } else {
                optimized[key] = node[key];
            }
        }

        return optimized;
    }

    eliminateDeadCode(node) {
        if (!node) return node;

        // 항상 false인 조건문 제거
        if (node.type === 'IfStatement') {
            const condition = this.evaluateConstantCondition(node.condition);

            if (condition === false) {
                return node.else ? this.eliminateDeadCode(node.else) : null;
            } else if (condition === true) {
                return this.eliminateDeadCode(node.then);
            }
        }

        // 재귀적으로 처리
        const cleaned = {};
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    cleaned[key] = node[key]
                        .map(child => this.eliminateDeadCode(child))
                        .filter(child => child !== null);
                } else {
                    cleaned[key] = this.eliminateDeadCode(node[key]);
                }
            } else {
                cleaned[key] = node[key];
            }
        }

        return cleaned;
    }

    evaluateConstantCondition(node) {
        if (!node) return null;

        if (node.type === 'Literal') {
            if (node.dataType === 'boolean') {
                return node.value;
            }
            return null;
        }

        if (node.type === 'LogicalExpression') {
            const left = this.evaluateConstantCondition(node.left);
            const right = this.evaluateConstantCondition(node.right);

            if (left !== null && right !== null) {
                switch (node.operator) {
                    case '&&':
                    case 'and':
                        return left && right;
                    case '||':
                    case 'or':
                        return left || right;
                }
            }
        }

        return null;
    }

    simplifyExpressions(node) {
        if (!node) return node;

        // x + 0 -> x, x * 1 -> x 등 단순화
        if (node.type === 'ArithmeticExpression') {
            const left = this.simplifyExpressions(node.left);
            const right = this.simplifyExpressions(node.right);

            // x + 0 = x
            if (node.operator === '+' && right.type === 'Literal' &&
                right.value === 0) {
                return left;
            }

            // 0 + x = x
            if (node.operator === '+' && left.type === 'Literal' &&
                left.value === 0) {
                return right;
            }

            // x * 1 = x
            if (node.operator === '*' && right.type === 'Literal' &&
                right.value === 1) {
                return left;
            }

            // 1 * x = x
            if (node.operator === '*' && left.type === 'Literal' &&
                left.value === 1) {
                return right;
            }

            // x * 0 = 0
            if (node.operator === '*' &&
                (right.type === 'Literal' && right.value === 0 ||
                 left.type === 'Literal' && left.value === 0)) {
                return {
                    type: 'Literal',
                    value: 0,
                    dataType: 'number'
                };
            }

            return { ...node, left, right };
        }

        // 재귀적으로 단순화
        const simplified = {};
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    simplified[key] = node[key].map(child => this.simplifyExpressions(child));
                } else {
                    simplified[key] = this.simplifyExpressions(node[key]);
                }
            } else {
                simplified[key] = node[key];
            }
        }

        return simplified;
    }

    // 컴파일
    compile(ast) {
        const compiled = {
            version: '1.0',
            timestamp: Date.now(),
            bytecode: [],
            symbols: new Map(),
            constants: [],
            metadata: {}
        };

        const compiler = new APLCompiler(this);
        return compiler.compile(ast);
    }

    // 헬퍼 함수들
    isBuiltinVariable(name) {
        const builtins = [
            'time', 'gcd', 'target', 'self', 'pet', 'focus',
            'combat', 'moving', 'casting', 'channeling'
        ];
        return builtins.includes(name.replace('$', ''));
    }

    isValidAction(name) {
        // 실제 게임의 액션인지 확인
        // 여기서는 간단히 처리
        return true;
    }

    resetParsingState() {
        this.parsingState = {
            currentLine: 0,
            currentColumn: 0,
            currentToken: null,
            tokens: [],
            errors: [],
            warnings: []
        };
    }

    // 런타임 함수들 (실행 시 사용)
    wait(time) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }

    poolResource(resource, amount) {
        // 리소스 풀링
    }

    cancelBuff(buff) {
        // 버프 취소
    }

    useItem(item) {
        // 아이템 사용
    }

    callActionList(listName) {
        // 액션 리스트 호출
    }

    runActionList(listName) {
        // 액션 리스트 실행
    }

    strictSequence(actions) {
        // 엄격한 순서로 액션 실행
    }

    setVariable(name, value) {
        this.variables.set(name, value);
    }

    cycleVariable(name, values) {
        // 변수 순환
    }

    snapshotStats() {
        // 스탯 스냅샷
    }

    startBurnPhase() {
        // 버스트 페이즈 시작
    }

    stopBurnPhase() {
        // 버스트 페이즈 종료
    }

    // 조건 평가 함수들
    isMoving() {
        return this.context.player?.isMoving || false;
    }

    isCasting() {
        return this.context.player?.isCasting || false;
    }

    isChanneling() {
        return this.context.player?.isChanneling || false;
    }

    inGCD() {
        return this.context.player?.inGCD || false;
    }

    inBurnPhase() {
        return this.context.player?.inBurnPhase || false;
    }

    inConservePhase() {
        return !this.inBurnPhase();
    }

    inExecutePhase() {
        return this.context.target?.healthPercent < 0.2;
    }

    inOpenerSequence() {
        return this.context.time < 10 && this.context.combat;
    }

    hasBloodlust() {
        return this.context.player?.hasBloodlust || false;
    }

    hasPotionActive() {
        return this.context.player?.hasPotionActive || false;
    }

    hasRacialActive() {
        return this.context.player?.hasRacialActive || false;
    }

    hasTrinketActive() {
        return this.context.player?.hasTrinketActive || false;
    }

    // 게임 데이터 접근 함수들
    getTimeToDie() {
        return this.context.target?.timeToDie || 999;
    }

    getTimeToMaxEnergy() {
        return this.context.player?.timeToMaxEnergy || 0;
    }

    getSpellTargets(spell) {
        return this.context.environment?.getSpellTargets(spell) || 1;
    }

    getActiveEnemies() {
        return this.context.environment?.activeEnemies || 1;
    }

    getComboPoints() {
        return this.context.player?.comboPoints || 0;
    }

    getResource(type) {
        return this.context.player?.resources?.[type]?.current || 0;
    }

    getBuffRemains(buff) {
        return this.context.player?.getBuffRemains(buff) || 0;
    }

    getDebuffRemains(debuff) {
        return this.context.target?.getDebuffRemains(debuff) || 0;
    }

    getCooldownRemains(spell) {
        return this.context.player?.getCooldownRemains(spell) || 0;
    }

    getCharges(spell) {
        return this.context.player?.getCharges(spell) || 0;
    }

    getStacks(buff) {
        return this.context.player?.getStacks(buff) || 0;
    }

    isRefreshable(dot) {
        const remains = this.getDebuffRemains(dot);
        const duration = this.context.player?.getSpellDuration(dot) || 0;
        return remains < duration * 0.3;
    }

    inPandemic(dot) {
        const remains = this.getDebuffRemains(dot);
        const duration = this.context.player?.getSpellDuration(dot) || 0;
        return remains < duration * 0.3;
    }
}

// APL 컴파일러 클래스
class APLCompiler {
    constructor(parser) {
        this.parser = parser;
        this.bytecode = [];
        this.symbols = new Map();
        this.constants = [];
        this.labelCounter = 0;
    }

    compile(ast) {
        this.compileNode(ast);
        return {
            bytecode: this.bytecode,
            symbols: this.symbols,
            constants: this.constants
        };
    }

    compileNode(node) {
        if (!node) return;

        switch (node.type) {
            case 'Program':
                this.compileProgram(node);
                break;
            case 'ActionsBlock':
                this.compileActionsBlock(node);
                break;
            case 'ActionLine':
                this.compileActionLine(node);
                break;
            case 'ActionCall':
                this.compileActionCall(node);
                break;
            case 'IfStatement':
                this.compileIfStatement(node);
                break;
            case 'WhileLoop':
                this.compileWhileLoop(node);
                break;
            case 'ForLoop':
                this.compileForLoop(node);
                break;
            case 'VariableAssignment':
                this.compileVariableAssignment(node);
                break;
            case 'FunctionCall':
                this.compileFunctionCall(node);
                break;
            case 'LogicalExpression':
                this.compileLogicalExpression(node);
                break;
            case 'ComparisonExpression':
                this.compileComparisonExpression(node);
                break;
            case 'ArithmeticExpression':
                this.compileArithmeticExpression(node);
                break;
            case 'Literal':
                this.compileLiteral(node);
                break;
            case 'Variable':
                this.compileVariable(node);
                break;
            case 'Block':
                this.compileBlock(node);
                break;
            default:
                console.warn(`Unknown node type: ${node.type}`);
        }
    }

    compileProgram(node) {
        for (const statement of node.body) {
            this.compileNode(statement);
        }
        this.emit('HALT');
    }

    compileActionsBlock(node) {
        this.emit('BLOCK_START', node.name);
        for (const action of node.actions) {
            this.compileNode(action);
        }
        this.emit('BLOCK_END');
    }

    compileActionLine(node) {
        if (node.condition) {
            this.compileNode(node.condition);
            const skipLabel = this.newLabel();
            this.emit('JMP_FALSE', skipLabel);
            this.compileNode(node.action);
            this.emitLabel(skipLabel);
        } else {
            this.compileNode(node.action);
        }
    }

    compileActionCall(node) {
        // 파라미터 푸시
        for (const [key, value] of node.parameters) {
            this.compileNode(value);
        }
        this.emit('CALL_ACTION', node.name, node.parameters.size);
    }

    compileIfStatement(node) {
        this.compileNode(node.condition);

        const elseLabel = this.newLabel();
        const endLabel = this.newLabel();

        this.emit('JMP_FALSE', elseLabel);
        this.compileNode(node.then);
        this.emit('JMP', endLabel);

        this.emitLabel(elseLabel);
        if (node.else) {
            this.compileNode(node.else);
        }

        this.emitLabel(endLabel);
    }

    compileWhileLoop(node) {
        const loopLabel = this.newLabel();
        const endLabel = this.newLabel();

        this.emitLabel(loopLabel);
        this.compileNode(node.condition);
        this.emit('JMP_FALSE', endLabel);
        this.compileNode(node.body);
        this.emit('JMP', loopLabel);
        this.emitLabel(endLabel);
    }

    compileForLoop(node) {
        if (node.initialization) {
            this.compileNode(node.initialization);
        }

        const loopLabel = this.newLabel();
        const endLabel = this.newLabel();

        this.emitLabel(loopLabel);
        if (node.condition) {
            this.compileNode(node.condition);
            this.emit('JMP_FALSE', endLabel);
        }

        this.compileNode(node.body);

        if (node.update) {
            this.compileNode(node.update);
        }

        this.emit('JMP', loopLabel);
        this.emitLabel(endLabel);
    }

    compileVariableAssignment(node) {
        this.compileNode(node.value);
        this.emit('STORE_VAR', node.variable);
    }

    compileFunctionCall(node) {
        for (const arg of node.arguments) {
            this.compileNode(arg);
        }
        this.emit('CALL_FUNC', node.name, node.arguments.length);
    }

    compileLogicalExpression(node) {
        this.compileNode(node.left);
        this.compileNode(node.right);

        switch (node.operator) {
            case '&&':
            case 'and':
                this.emit('AND');
                break;
            case '||':
            case 'or':
                this.emit('OR');
                break;
        }
    }

    compileComparisonExpression(node) {
        this.compileNode(node.left);
        this.compileNode(node.right);

        switch (node.operator) {
            case '==': this.emit('EQ'); break;
            case '!=': this.emit('NEQ'); break;
            case '<': this.emit('LT'); break;
            case '>': this.emit('GT'); break;
            case '<=': this.emit('LTE'); break;
            case '>=': this.emit('GTE'); break;
        }
    }

    compileArithmeticExpression(node) {
        this.compileNode(node.left);
        this.compileNode(node.right);

        switch (node.operator) {
            case '+': this.emit('ADD'); break;
            case '-': this.emit('SUB'); break;
            case '*': this.emit('MUL'); break;
            case '/': this.emit('DIV'); break;
            case '%': this.emit('MOD'); break;
        }
    }

    compileLiteral(node) {
        const index = this.addConstant(node.value);
        this.emit('LOAD_CONST', index);
    }

    compileVariable(node) {
        this.emit('LOAD_VAR', node.name);
    }

    compileBlock(node) {
        for (const statement of node.statements) {
            this.compileNode(statement);
        }
    }

    emit(opcode, ...args) {
        this.bytecode.push({ opcode, args });
    }

    emitLabel(label) {
        this.symbols.set(label, this.bytecode.length);
    }

    newLabel() {
        return `L${this.labelCounter++}`;
    }

    addConstant(value) {
        const index = this.constants.length;
        this.constants.push(value);
        return index;
    }
}

module.exports = APLParser;