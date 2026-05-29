const screen = document.getElementById('screen');
const buttons = document.querySelector('.buttons');

const state = {
    currentOperand: '',
    expression: [],
    justEvaluated: false
};

function resetState() {
    state.currentOperand = '';
    state.expression = [];
    state.justEvaluated = false;
}

function formatNumber(n) {
    if (!isFinite(n)) return 'Error';
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    return String(parseFloat(Number(n).toPrecision(12)));
}

function displayNumber(n) {
    const s = formatNumber(n);
    if (s.length > 14) return Number(n).toExponential(6);
    return s;
}

function opSymbol(op) {
    return { '*': '×', '/': '÷', '+': '+', '-': '−' }[op] || op;
}

function formatExpression() {
    const parts = [];
    for (const t of state.expression) {
        parts.push(typeof t === 'number' ? formatNumber(t) : opSymbol(t));
    }
    if (state.currentOperand !== '') {
        parts.push(state.currentOperand);
    }
    return parts.join(' ') || '0';
}

function updateDisplay() {
    screen.value = formatExpression();
}

function evaluatePEMDAS(tokens) {
    let i = 1;
    while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const l = tokens[i - 1];
            const r = tokens[i + 1];
            tokens.splice(i - 1, 3, tokens[i] === '*' ? l * r : l / r);
        } else {
            i += 2;
        }
    }
    i = 1;
    while (i < tokens.length) {
        if (tokens[i] === '+' || tokens[i] === '-') {
            const l = tokens[i - 1];
            const r = tokens[i + 1];
            tokens.splice(i - 1, 3, tokens[i] === '+' ? l + r : l - r);
        } else {
            i += 2;
        }
    }
    return tokens[0];
}

function handleDigit(d) {
    if (state.justEvaluated) {
        resetState();
    }
    if (d === '.') {
        if (state.currentOperand === '') {
            state.currentOperand = '0.';
            updateDisplay();
            return;
        }
        if (state.currentOperand.includes('.')) return;
        state.currentOperand += '.';
        updateDisplay();
        return;
    }
    if (state.currentOperand === '0' && d !== '.') {
        state.currentOperand = d;
    } else {
        state.currentOperand += d;
    }
    if (state.currentOperand.length > 16) return;
    updateDisplay();
}

function handleOperator(op) {
    if (state.justEvaluated) {
        state.expression = [parseFloat(state.currentOperand)];
        state.currentOperand = '';
        state.justEvaluated = false;
    }
    if (state.currentOperand !== '') {
        state.expression.push(parseFloat(state.currentOperand));
        state.currentOperand = '';
    }
    if (state.expression.length === 0) {
        if (op === '-') {
            state.currentOperand = '-';
        }
        updateDisplay();
        return;
    }
    const last = state.expression[state.expression.length - 1];
    if (typeof last === 'string') {
        if (op === '-' && state.currentOperand === '') {
            state.currentOperand = '-';
            updateDisplay();
            return;
        }
        state.expression[state.expression.length - 1] = op;
        updateDisplay();
        return;
    }
    state.expression.push(op);
    updateDisplay();
}

function handleEquals() {
    if (state.justEvaluated) return;
    if (state.currentOperand !== '') {
        state.expression.push(parseFloat(state.currentOperand));
        state.currentOperand = '';
    }
    if (state.expression.length < 3) return;
    if (typeof state.expression[state.expression.length - 1] === 'string') {
        state.expression.pop();
    }
    const result = evaluatePEMDAS([...state.expression]);
    if (!isFinite(result)) {
        state.currentOperand = 'Error';
        state.expression = [];
        state.justEvaluated = true;
        updateDisplay();
        return;
    }
    state.currentOperand = displayNumber(result);
    state.expression = [result];
    state.justEvaluated = true;
    updateDisplay();
}

function handleClear() {
    resetState();
    updateDisplay();
}

function handleBackspace() {
    if (state.justEvaluated) {
        handleClear();
        return;
    }
    if (state.currentOperand === '' && state.expression.length > 1) {
        const op = state.expression.pop();
        if (typeof op === 'string') {
            const prev = state.expression.pop();
            if (typeof prev === 'number') {
                state.currentOperand = displayNumber(prev);
            }
        }
        updateDisplay();
        return;
    }
    if (state.currentOperand.length <= 1) {
        state.currentOperand = '';
    } else {
        state.currentOperand = state.currentOperand.slice(0, -1);
    }
    updateDisplay();
}

buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const type = btn.dataset.type;
    if (type === 'digit') {
        handleDigit(btn.dataset.digit);
    } else if (type === 'operator') {
        handleOperator(btn.dataset.op);
    } else if (type === 'action') {
        const action = btn.dataset.action;
        if (action === 'equals') handleEquals();
        else if (action === 'clear') handleClear();
        else if (action === 'backspace') handleBackspace();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
        return;
    }
    if (e.key === '.') {
        handleDigit('.');
        return;
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
        return;
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
        return;
    }
    if (e.key === 'Backspace') {
        handleBackspace();
        return;
    }
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
        return;
    }
});

updateDisplay();
