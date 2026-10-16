import React, { useState } from 'react';

export default function Calculator() {
	const [display, setDisplay] = useState('0');
	const [stored, setStored] = useState(null);
	const [operator, setOperator] = useState(null);
	const [fresh, setFresh] = useState(false);

	const digit = (value) => {
		setDisplay((current) => (fresh || current === '0' ? value : current + value));
		setFresh(false);
	};

	const compute = (left, right, op) => {
		switch (op) {
			case '+': return left + right;
			case '−': return left - right;
			case '×': return left * right;
			case '÷': return right === 0 ? 'Error' : left / right;
			default: return right;
		}
	};

	const chooseOperator = (op) => {
		const value = Number(display);
		if (operator && !fresh && stored !== null) {
			const result = compute(stored, value, operator);
			setDisplay(String(result));
			setStored(typeof result === 'number' ? result : null);
		} else {
			setStored(value);
		}
		setOperator(op);
		setFresh(true);
	};

	const equals = () => {
		if (!operator || stored === null) return;
		setDisplay(String(compute(stored, Number(display), operator)));
		setStored(null);
		setOperator(null);
		setFresh(true);
	};

	const clear = () => {
		setDisplay('0');
		setStored(null);
		setOperator(null);
		setFresh(false);
	};

	const decimal = () => {
		if (fresh) {
			setDisplay('0.');
			setFresh(false);
		} else if (!display.includes('.')) {
			setDisplay(`${display}.`);
		}
	};

	const keys = [
		['C', clear, 'utility'], ['÷', () => chooseOperator('÷'), 'operator'],
		['×', () => chooseOperator('×'), 'operator'], ['−', () => chooseOperator('−'), 'operator'],
		['7', () => digit('7')], ['8', () => digit('8')], ['9', () => digit('9')],
		['+', () => chooseOperator('+'), 'operator'],
		['4', () => digit('4')], ['5', () => digit('5')], ['6', () => digit('6')],
		['1', () => digit('1')], ['2', () => digit('2')], ['3', () => digit('3')],
		['=', equals, 'equals'], ['0', () => digit('0'), 'wide'], ['.', decimal],
	];

	return (
		<main style={styles.page}>
			<section style={styles.calculator} aria-label="Calculator">
				<output style={styles.display} aria-live="polite">{display}</output>
				<div style={styles.keys}>
					{keys.map(([label, action, kind]) => (
						<button key={label} type="button" onClick={action}
							style={{ ...styles.button, ...(kind ? styles[kind] : {}) }}>
							{label}
						</button>
					))}
				</div>
			</section>
		</main>
	);
}

const styles = {
	page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f3f4f6', fontFamily: 'Arial, sans-serif' },
	calculator: { width: 'min(320px, calc(100vw - 32px))', padding: 18, borderRadius: 16, background: '#1f2937', boxShadow: '0 12px 30px #0003' },
	display: { boxSizing: 'border-box', minHeight: 72, marginBottom: 14, padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', borderRadius: 10, background: '#111827', color: '#fff', fontSize: 36, fontVariantNumeric: 'tabular-nums' },
	keys: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
	button: { minHeight: 56, border: 0, borderRadius: 10, background: '#374151', color: '#fff', fontSize: 20, cursor: 'pointer' },
	operator: { background: '#4b5563' },
	utility: { background: '#6b7280' },
	equals: { gridColumn: '4', gridRow: '4 / span 2', background: '#2563eb' },
	wide: { gridColumn: 'span 2' },
};
