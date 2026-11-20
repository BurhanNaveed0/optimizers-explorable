// Landscape gallery for the Playground: 2-parameter losses that are NOT a
// linear-regression bowl, to show what plain regression can't (curved valleys,
// saddle points, plateaus, multiple minima).
//
// Each entry is a "problem" understood by optim.js ({ loss, grad, minima })
// plus what the Playground needs to show it: view window, start point,
// tuned optimizer settings, and a caption saying what to look for.

const ADAM = { beta1: 0.9, beta2: 0.999, eps: 1e-8 };

/** Newton's method on ∇f = 0 to locate a minimum precisely (2D, numeric Hessian). */
function refine(grad, p) {
	let [x, y] = p;
	const h = 1e-5;
	for (let i = 0; i < 50; i++) {
		const g = grad([x, y]);
		const gx = grad([x + h, y]),
			gy = grad([x, y + h]);
		const a = (gx[0] - g[0]) / h,
			b = (gy[0] - g[0]) / h,
			c = (gx[1] - g[1]) / h,
			d = (gy[1] - g[1]) / h;
		const det = a * d - b * c;
		if (Math.abs(det) < 1e-12) break;
		x -= (d * g[0] - b * g[1]) / det;
		y -= (-c * g[0] + a * g[1]) / det;
	}
	return [x, y];
}

// --- Curved valley (Rosenbrock) ---------------------------------------------
// f = (1 − x)² + B (y − x²)²   minimum at (1, 1), inside a curved, banana-shaped valley.
const B = 10;
const rosen = {
	loss: ([x, y]) => (1 - x) ** 2 + B * (y - x * x) ** 2,
	grad: ([x, y]) => [-2 * (1 - x) - 4 * B * x * (y - x * x), 2 * B * (y - x * x)],
	minima: [[1, 1]]
};

// --- Saddle point ------------------------------------------------------------
// f = x² − y² + y⁴/4 + 1   saddle at (0, 0); minima at (0, ±√2) with f = 0.
const saddle = {
	loss: ([x, y]) => x * x - y * y + y ** 4 / 4 + 1,
	grad: ([x, y]) => [2 * x, -2 * y + y ** 3],
	minima: [
		[0, Math.SQRT2],
		[0, -Math.SQRT2]
	],
	minimaLabels: ["minimum", "minimum"]
};

// --- Plateau -------------------------------------------------------------------
// f = 1 − exp(−(x² + 2y²) / 2)   a narrow dip in an almost perfectly flat plain.
const plateau = {
	loss: ([x, y]) => 1 - Math.exp(-(x * x + 2 * y * y) / 2),
	grad: ([x, y]) => {
		const e = Math.exp(-(x * x + 2 * y * y) / 2);
		return [x * e, 2 * y * e];
	},
	minima: [[0, 0]]
};

// --- Two minima (tilted double well) -------------------------------------------
// f = (x² − 1)² + y² − 0.3x + C   right well (x ≈ 1) is deeper than the left one.
const TILT = 0.3;
const wellGrad = ([x, y]) => [4 * x * (x * x - 1) - TILT, 2 * y];
const wellMinRight = refine(wellGrad, [1, 0]);
const wellMinLeft = refine(wellGrad, [-1, 0]);
const wellRaw = ([x, y]) => (x * x - 1) ** 2 + y * y - TILT * x;
const C = -wellRaw(wellMinRight); // shift so the global minimum has loss 0
const wells = {
	loss: (t) => wellRaw(t) + C,
	grad: wellGrad,
	minima: [wellMinRight, wellMinLeft],
	minimaLabels: ["deeper", "shallower"]
};

export const GALLERY = {
	rosenbrock: {
		name: "Curved valley",
		problem: rosen,
		xDomain: [-2, 2],
		yDomain: [-1, 3],
		start: [-1.6, 2.6],
		steps: 100,
		hp: { gd: { lr: 0.004 }, momentum: { lr: 0.0015, beta: 0.9 }, adam: { lr: 0.1, ...ADAM } },
		caption:
			"A banana-shaped valley with steep walls. The walls force a small learning rate, so GD barely creeps along the floor. Momentum builds speed around the bend; Adam reaches the minimum."
	},
	saddle: {
		name: "Saddle point",
		problem: saddle,
		xDomain: [-2.2, 2.2],
		yDomain: [-2.2, 2.2],
		start: [-2, 0.001],
		steps: 80,
		hp: { gd: { lr: 0.05 }, momentum: { lr: 0.01, beta: 0.9 }, adam: { lr: 0.08, ...ADAM } },
		caption:
			"Downhill in one direction, uphill in the other. Starting almost on the ridge, the gradient toward either valley is tiny: GD and Momentum stall at the saddle, while Adam scales that tiny gradient up and breaks away at once."
	},
	plateau: {
		name: "Plateau",
		problem: plateau,
		xDomain: [-3.5, 3.5],
		yDomain: [-2.5, 2.5],
		start: [-3, 1.5],
		steps: 50,
		levels: "linear", // evenly spaced loss levels leave the flat plain empty
		hp: { gd: { lr: 1 }, momentum: { lr: 0.3, beta: 0.9 }, adam: { lr: 0.1, ...ADAM } },
		caption:
			"A small dip in a huge flat plain. Gradients out on the plain are nearly zero: GD barely moves, Momentum slowly builds speed, Adam rescales the tiny gradients and walks straight in."
	},
	wells: {
		name: "Two minima",
		problem: wells,
		xDomain: [-2, 2],
		yDomain: [-1.6, 1.6],
		start: [-1.9, 1.3],
		steps: 60,
		hp: { gd: { lr: 0.02 }, momentum: { lr: 0.01, beta: 0.9 }, adam: { lr: 0.05, ...ADAM } },
		caption:
			"Two valleys, and the right one is deeper. Where you end up depends on the optimizer and the start: GD and Adam settle in the nearest (shallower) valley, while Momentum carries enough speed to roll over the bump into the deeper one."
	}
};
