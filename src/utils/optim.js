// Core math for the explorable: one dataset, the MSE loss for ŷ = θ₀ + θ₁x,
// its gradient, and the three optimizers (GD, Momentum, Adam).
//
// Everything shown on the slides is computed from here, so the numbers,
// paths and loss curves are all real.

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------
// x is centered at 0, which makes the loss surface a nearly round bowl.
// Later slides shift x away from 0 (see `shift`), which stretches the same bowl
// into a long, narrow valley without changing the model or the loss.
const NOISE = [-0.35, 0.45, -0.25, 0.5, -0.3, 0.35, -0.2, 0.25, 0.55, -0.4];
export const BASE_X = NOISE.map((_, i) => -1.5 + i / 3);
export const DATA_Y = BASE_X.map((x, i) => 9 + 2.2 * x + NOISE[i]);

/**
 * The dataset as [x, y] pairs. `scale` and `shift` rescale x (x → scale·x + shift).
 * scale = 1, shift = 0 gives the round bowl; larger values stretch it into a valley.
 */
export function dataset({ scale = 1, shift = 0 } = {}) {
	return BASE_X.map((x, i) => [scale * x + shift, DATA_Y[i]]);
}

const ADAM = { beta1: 0.9, beta2: 0.999, eps: 1e-8 };

/**
 * The two landscapes used in the explorable.
 *  - round:  slides 1–6 (x centered at 0) and the left panel of slide 17
 *  - valley: slides 7–17 (x not centered or scaled: x runs from −12 to 6)
 * Each has its own start point and learning rates, tuned so all three
 * optimizers stay stable.
 */
export const LANDSCAPES = {
	round: {
		scale: 1,
		shift: 0,
		start: [6.5, 0.15],
		hp: {
			gd: { lr: 0.1 },
			momentum: { lr: 0.01, beta: 0.9 },
			adam: { lr: 0.15, ...ADAM }
		}
	},
	valley: {
		scale: 6,
		shift: -3,
		// start = minimum + offset
		startOffset: [-6, -0.1],
		hp: {
			gd: { lr: 0.022 },
			momentum: { lr: 0.003, beta: 0.9 },
			adam: { lr: 0.2, ...ADAM }
		}
	}
};

/** Initial guess on slides 2–6. */
export const START = LANDSCAPES.round.start;

/** Learning rate used on slide 6 so three steps make visible progress. */
export const SLIDE6_LR = 0.2;

export const ROUND_DATA = dataset(LANDSCAPES.round);
export const VALLEY_DATA = dataset(LANDSCAPES.valley);

// ---------------------------------------------------------------------------
// Loss and gradient
// ---------------------------------------------------------------------------
export const predict = ([t0, t1], x) => t0 + t1 * x;

export function residuals(theta, data) {
	return data.map(([x, y]) => y - predict(theta, x));
}

/** Mean squared error L(θ₀, θ₁) = (1/n) Σ (yᵢ − ŷᵢ)². */
export function loss(theta, data) {
	const r = residuals(theta, data);
	return r.reduce((s, v) => s + v * v, 0) / r.length;
}

/** ∇L = [−(2/n) Σ rᵢ, −(2/n) Σ rᵢxᵢ]. */
export function grad(theta, data) {
	const n = data.length;
	let g0 = 0,
		g1 = 0;
	for (const [x, y] of data) {
		const r = y - predict(theta, x);
		g0 += r;
		g1 += r * x;
	}
	return [(-2 / n) * g0, (-2 / n) * g1];
}

/** Closed-form least-squares minimum. */
export function minimum(data) {
	const n = data.length;
	const mx = data.reduce((s, d) => s + d[0], 0) / n;
	const my = data.reduce((s, d) => s + d[1], 0) / n;
	let sxy = 0,
		sxx = 0;
	for (const [x, y] of data) {
		sxy += (x - mx) * (y - my);
		sxx += (x - mx) ** 2;
	}
	const t1 = sxy / sxx;
	return [my - t1 * mx, t1];
}

// ---------------------------------------------------------------------------
// Optimizers. Each returns an array of steps:
//   { theta, loss, grad, update, ...optimizer-specific state }
// where step k holds θ_k and the update that takes θ_k → θ_{k+1}.
// ---------------------------------------------------------------------------
export const DEFAULTS = LANDSCAPES.valley.hp;

export function runGD(start, data, steps, { lr } = DEFAULTS.gd) {
	const out = [];
	let theta = [...start];
	for (let k = 0; k <= steps; k++) {
		const g = grad(theta, data);
		const update = [-lr * g[0], -lr * g[1]];
		out.push({ theta, loss: loss(theta, data), grad: g, update, lr });
		theta = [theta[0] + update[0], theta[1] + update[1]];
	}
	return out;
}

export function runMomentum(start, data, steps, { lr, beta } = DEFAULTS.momentum) {
	const out = [];
	let theta = [...start];
	let v = [0, 0];
	for (let k = 0; k <= steps; k++) {
		const g = grad(theta, data);
		const vPrev = v;
		v = [beta * v[0] + g[0], beta * v[1] + g[1]];
		const update = [-lr * v[0], -lr * v[1]];
		out.push({ theta, loss: loss(theta, data), grad: g, vPrev, v, update, lr, beta });
		theta = [theta[0] + update[0], theta[1] + update[1]];
	}
	return out;
}

export function runAdam(start, data, steps, { lr, beta1, beta2, eps } = DEFAULTS.adam) {
	const out = [];
	let theta = [...start];
	let m = [0, 0],
		v = [0, 0];
	for (let k = 0; k <= steps; k++) {
		const t = k + 1;
		const g = grad(theta, data);
		m = [beta1 * m[0] + (1 - beta1) * g[0], beta1 * m[1] + (1 - beta1) * g[1]];
		v = [beta2 * v[0] + (1 - beta2) * g[0] ** 2, beta2 * v[1] + (1 - beta2) * g[1] ** 2];
		const mHat = [m[0] / (1 - beta1 ** t), m[1] / (1 - beta1 ** t)];
		const vHat = [v[0] / (1 - beta2 ** t), v[1] / (1 - beta2 ** t)];
		// Effective per-parameter learning rate: η / (√v̂ + ε)
		const stepSize = [lr / (Math.sqrt(vHat[0]) + eps), lr / (Math.sqrt(vHat[1]) + eps)];
		const update = [-stepSize[0] * mHat[0], -stepSize[1] * mHat[1]];
		out.push({ theta, loss: loss(theta, data), grad: g, m, v, mHat, vHat, stepSize, update, lr });
		theta = [theta[0] + update[0], theta[1] + update[1]];
	}
	return out;
}

export const OPTIMIZERS = {
	gd: { name: "Gradient descent", color: "#3b82f6", dash: "", run: runGD },
	momentum: { name: "Momentum", color: "#ef4444", dash: "10 7", run: runMomentum },
	adam: { name: "Adam", color: "#16a34a", dash: "2 6", run: runAdam }
};

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
export function fmt(v, digits = 2) {
	const s = v.toFixed(digits);
	return s === `-${(0).toFixed(digits)}` ? (0).toFixed(digits) : s;
}

// ---------------------------------------------------------------------------
// Derived landscape helpers
// ---------------------------------------------------------------------------
export const ROUND_MIN = minimum(ROUND_DATA);
export const VALLEY_MIN = minimum(VALLEY_DATA);
export const VALLEY_START = [
	VALLEY_MIN[0] + LANDSCAPES.valley.startOffset[0],
	VALLEY_MIN[1] + LANDSCAPES.valley.startOffset[1]
];

const lerp = (a, b, t) => a + (b - a) * t;
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));

/**
 * A landscape part-way between round (t = 0) and valley (t = 1).
 * Learning rates are interpolated on a log scale so every optimizer stays stable.
 */
export function stretched(t) {
	const R = LANDSCAPES.round,
		V = LANDSCAPES.valley;
	const data = dataset({ scale: lerp(R.scale, V.scale, t), shift: lerp(R.shift, V.shift, t) });
	const min = minimum(data);
	const rOff = [R.start[0] - ROUND_MIN[0], R.start[1] - ROUND_MIN[1]];
	const off = [lerp(rOff[0], V.startOffset[0], t), lerp(rOff[1], V.startOffset[1], t)];
	const hp = {};
	for (const k of ["gd", "momentum", "adam"]) {
		hp[k] = { ...V.hp[k], lr: logLerp(R.hp[k].lr, V.hp[k].lr, t) };
	}
	return { data, min, start: [min[0] + off[0], min[1] + off[1]], hp };
}

/** Run all three optimizers from `start` on `data`. */
export function runAll(start, data, steps, hp) {
	return {
		gd: runGD(start, data, steps, hp.gd),
		momentum: runMomentum(start, data, steps, hp.momentum),
		adam: runAdam(start, data, steps, hp.adam)
	};
}
