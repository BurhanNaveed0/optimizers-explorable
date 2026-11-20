// Shared setup for every slide that uses the narrow valley (slides 7–17),
// so all of them show exactly the same landscape, start point and runs.
import { LANDSCAPES, VALLEY_DATA, VALLEY_START, OPTIMIZERS, runAll } from "$utils/optim.js";

export const STEPS = 40;
export const xDomain = [3, 12.5];
export const yDomain = [-1.1, 1.6];
export const data = VALLEY_DATA;
export const start = VALLEY_START;
export const runs = runAll(VALLEY_START, VALLEY_DATA, STEPS, LANDSCAPES.valley.hp);
export const points = (run) => run.map((s) => s.theta);

/** Contour `paths` entry styled for an optimizer. */
export const pathFor = (key, run = runs[key], extra = {}) => ({
	points: points(run),
	color: OPTIMIZERS[key].color,
	dash: OPTIMIZERS[key].dash,
	width: key === "adam" ? 5 : 4,
	dotR: 4.5,
	...extra
});

export const legendFor = (key, extra = {}) => ({
	label: OPTIMIZERS[key].name,
	color: OPTIMIZERS[key].color,
	dash: OPTIMIZERS[key].dash,
	width: key === "adam" ? 5 : 4,
	...extra
});

// Direction of a parameter-space vector as it appears on screen, so arrows of
// very different raw sizes can be drawn at the same visible length.
const SX = xDomain[1] - xDomain[0];
const SY = yDomain[1] - yDomain[0];
export function screenArrow(from, vec, len = 0.16) {
	const sx = vec[0] / SX,
		sy = vec[1] / SY;
	const n = Math.hypot(sx, sy) || 1;
	return { from, to: [from[0] + (sx / n) * len * SX, from[1] + (sy / n) * len * SY] };
}
export function screenAngle(a, b) {
	const ax = a[0] / SX, ay = a[1] / SY, bx = b[0] / SX, by = b[1] / SY;
	const c = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
	return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

/**
 * The "ideal moment" for Conceptual Question 1: the Momentum step where its
 * actual update points furthest away from the negative gradient.
 */
export const Q1_STEP = (() => {
	let best = 1, bestAngle = -1;
	runs.momentum.forEach((s, k) => {
		if (k < 3) return;
		const ang = screenAngle(s.update, [-s.grad[0], -s.grad[1]]);
		if (ang > bestAngle) (bestAngle = ang), (best = k);
	});
	return best;
})();
