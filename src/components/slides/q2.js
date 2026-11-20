import { stretched, ROUND_MIN } from "$utils/optim.js";
import { xDomain, yDomain } from "./valley.js";

// View windows relative to each landscape's minimum, so the plot can morph
// smoothly from the round bowl (t = 0) to the valley (t = 1).
const R0 = { x: [5 - ROUND_MIN[0], 13 - ROUND_MIN[0]], y: [-0.8 - ROUND_MIN[1], 5.2 - ROUND_MIN[1]] };
const V = stretched(1).min;
const V1 = { x: [xDomain[0] - V[0], xDomain[1] - V[0]], y: [yDomain[0] - V[1], yDomain[1] - V[1]] };
const lerp = (a, b, t) => a + (b - a) * t;

export const roundView = (L) => ({
	xDomain: [L.min[0] + R0.x[0], L.min[0] + R0.x[1]],
	yDomain: [L.min[1] + R0.y[0], L.min[1] + R0.y[1]]
});
export const valleyView = (L, t) => ({
	xDomain: [L.min[0] + lerp(R0.x[0], V1.x[0], t), L.min[0] + lerp(R0.x[1], V1.x[1], t)],
	yDomain: [L.min[1] + lerp(R0.y[0], V1.y[0], t), L.min[1] + lerp(R0.y[1], V1.y[1], t)]
});
