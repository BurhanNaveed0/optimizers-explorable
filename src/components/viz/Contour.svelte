<script>
	import { contours, geoPath, geoTransform, scaleLinear } from "d3";
	import { createEventDispatcher } from "svelte";
	import { loss, minimum, minima } from "$utils/optim.js";
	import { arrowHead, starPoints } from "./arrow.js";

	/** Dataset defining the loss landscape. */
	export let data;
	/** Visible parameter ranges: θ₀ on the horizontal axis, θ₁ on the vertical. */
	export let xDomain;
	export let yDomain;
	/** Contour levels are spaced geometrically from the minimum up to the loss at `levelAnchor`. */
	export let levelAnchor = null;
	export let nLevels = 5;
	/** "geometric" (default, for bowls), "quantile" (any shape) or "linear" (even loss steps). */
	export let levels = "geometric";
	/**
	 * Paths: [{ points: [[θ₀, θ₁], ...], color, dash?, width?, opacity?, dots?, labels?, upTo? }]
	 * `upTo` draws only the first upTo+1 points (for step-by-step animation).
	 */
	export let paths = [];
	/** Arrows in parameter space: [{ from, to, color, dash?, width?, label? }] */
	export let arrows = [];
	/** Extra markers: [{ theta, color, r?, label?, stroke? }] */
	export let markers = [];
	export let showMin = true;
	export let minLabel = "minimum";
	export let xLabel = "θ₀ (intercept)";
	export let yLabel = "θ₁ (slope)";
	/** When true, clicking/dragging on the plot dispatches `pick` with a θ. */
	export let interactive = false;
	export let width = 640;
	export let height = 440;

	const dispatch = createEventDispatcher();
	const m = { t: 10, r: 10, b: 44, l: 44 };
	const uid = Math.random().toString(36).slice(2);

	$: x = scaleLinear().domain(xDomain).range([m.l, width - m.r]);
	$: y = scaleLinear().domain(yDomain).range([height - m.b, m.t]);
	$: min = minimum(data);
	$: allMinima = minima(data);

	// --- Contours ---------------------------------------------------------
	const NX = 140,
		NY = 100;
	$: grid = (() => {
		const vals = new Float64Array(NX * NY);
		for (let j = 0; j < NY; j++) {
			const t1 = yDomain[0] + ((j + 0.5) / NY) * (yDomain[1] - yDomain[0]);
			for (let i = 0; i < NX; i++) {
				const t0 = xDomain[0] + ((i + 0.5) / NX) * (xDomain[1] - xDomain[0]);
				vals[j * NX + i] = loss([t0, t1], data);
			}
		}
		return vals;
	})();
	$: lMin = loss(min, data);
	$: lAnchor = levelAnchor ? loss(levelAnchor, data) : lMin + 10;
	// "geometric" suits a bowl (rings tighten toward the minimum). "quantile"
	// spreads levels by how much of the view sits below each loss value, which
	// works for any shape (plateaus, saddles, several minima).
	// "linear" spaces levels evenly in loss value, so flat regions stay empty.
	$: thresholds =
		levels === "quantile"
			? quantileThresholds(grid, nLevels)
			: levels === "linear"
			? linearThresholds(grid, nLevels)
			: Array.from({ length: nLevels }, (_, k) => lMin + (lAnchor - lMin) * 1.6 * 0.42 ** k);
	function linearThresholds(vals, n) {
		let lo = Infinity, hi = -Infinity;
		for (const v of vals) (lo = Math.min(lo, v)), (hi = Math.max(hi, v));
		return Array.from({ length: n }, (_, k) => lo + ((k + 1) / (n + 1)) * (hi - lo));
	}
	function quantileThresholds(vals, n) {
		const sorted = Float64Array.from(vals).sort();
		// Denser near the bottom, where the interesting structure is.
		return Array.from({ length: n }, (_, k) => sorted[Math.floor(((k + 1) / (n + 1)) ** 1.6 * (sorted.length - 1))]);
	}
	$: contourPaths = (() => {
		const sx = (width - m.l - m.r) / NX;
		const sy = (height - m.t - m.b) / NY;
		const proj = geoTransform({
			point(px, py) {
				this.stream.point(m.l + px * sx, height - m.b - py * sy);
			}
		});
		const path = geoPath(proj);
		return contours().size([NX, NY]).thresholds(thresholds)(grid).map((c) => path(c));
	})();

	// --- Helpers ----------------------------------------------------------
	const P = (t) => [x(t[0]), y(t[1])];
	// Stop drawing at the first non-finite point (a diverged optimizer), and
	// clamp far-away points so the SVG path stays valid.
	const finite = (pts) => {
		const i = pts.findIndex((t) => !Number.isFinite(t[0]) || !Number.isFinite(t[1]));
		return i === -1 ? pts : pts.slice(0, i);
	};
	const BIG = 1e5;
	const cl = (v) => Math.max(-BIG, Math.min(BIG, v));
	const line = (pts) => finite(pts).map((t, i) => `${i ? "L" : "M"}${cl(x(t[0]))},${cl(y(t[1]))}`).join("");

	// --- Interaction ------------------------------------------------------
	let svgEl;
	let dragging = false;
	function toTheta(e) {
		const pt = svgEl.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const p = pt.matrixTransform(svgEl.getScreenCTM().inverse());
		const px = Math.min(Math.max(p.x, m.l), width - m.r);
		const py = Math.min(Math.max(p.y, m.t), height - m.b);
		return [x.invert(px), y.invert(py)];
	}
	function down(e) {
		if (!interactive) return;
		dragging = true;
		svgEl.setPointerCapture?.(e.pointerId);
		dispatch("pick", toTheta(e));
	}
	function move(e) {
		if (interactive && dragging) dispatch("pick", toTheta(e));
	}
	const up = () => (dragging = false);
</script>

<svg
	bind:this={svgEl}
	viewBox="0 0 {width} {height}"
	class="h-full w-full touch-none select-none {interactive ? 'cursor-crosshair' : ''}"
	role="img"
	aria-label="Contour plot of the loss landscape"
	on:pointerdown={down}
	on:pointermove={move}
	on:pointerup={up}
	on:pointercancel={up}
>
	<defs>
		<clipPath id="clip-{uid}"><rect rx="14" x={m.l} y={m.t} width={width - m.l - m.r} height={height - m.t - m.b} /></clipPath>
	</defs>

	<rect rx="14" x={m.l} y={m.t} width={width - m.l - m.r} height={height - m.t - m.b} fill="white" stroke="#d4d4d4" stroke-width="2" />

	<g clip-path="url(#clip-{uid})">
		{#each contourPaths as d}
			<path {d} fill="none" stroke="#9ca3af" stroke-width="2" />
		{/each}

		{#each paths as p}
			{@const pts = finite(p.upTo == null ? p.points : p.points.slice(0, p.upTo + 1))}
			<path
				d={line(pts)}
				fill="none"
				stroke={p.color}
				stroke-width={p.width ?? 4}
				stroke-dasharray={p.dash ?? ""}
				stroke-linecap={p.dash === "2 6" ? "round" : "round"}
				stroke-linejoin="round"
				opacity={p.opacity ?? 1}
			/>
			{#if p.dots !== false}
				{#each pts as t, i}
					{#if i > 0}
						<circle cx={x(t[0])} cy={y(t[1])} r={p.dotR ?? 5} fill={p.color} opacity={p.opacity ?? 1} />
					{/if}
				{/each}
			{/if}
			{#if p.labels}
				{#each pts as t, i}
					<text x={x(t[0]) + 6} y={y(t[1]) - 12} font-size="18" class="fill-neutral-800">{i}</text>
				{/each}
			{/if}
			<!-- start point -->
			{#if p.startDot !== false}
				<circle cx={x(p.points[0][0])} cy={y(p.points[0][1])} r="9" fill={p.startColor ?? p.color} stroke="#222" stroke-width="1.5" opacity={p.startOpacity ?? 1} />
			{/if}
		{/each}

		{#each arrows as a}
			{@const f = P(a.from)}
			{@const t = P(a.to)}
			<line x1={f[0]} y1={f[1]} x2={t[0]} y2={t[1]} stroke={a.color} stroke-width={a.width ?? 4} stroke-dasharray={a.dash ?? ""} />
			<path d={arrowHead(f, t, 16)} fill={a.color} />
		{/each}

		{#if showMin}
			<!-- One star per minimum; a problem can name them via `minimaLabels`. -->
			{#each allMinima as mn, i}
				{@const pm = P(mn)}
				{@const label = data?.minimaLabels?.[i] ?? (i === 0 ? minLabel : "")}
				<polygon points={starPoints(pm[0], pm[1], 15)} fill="#fbbf24" stroke="#222" stroke-width="1.5" />
				{#if label}
					<text x={pm[0] + 14} y={pm[1] + 30} font-size="17" class="fill-neutral-700">{label}</text>
				{/if}
			{/each}
		{/if}

		{#each markers as mk}
			{@const pm = P(mk.theta)}
			<circle cx={pm[0]} cy={pm[1]} r={mk.r ?? 9} fill={mk.color} stroke={mk.stroke ?? "#222"} stroke-width="1.5" />
			{#if mk.label}
				<text x={pm[0]} y={pm[1] - 16} text-anchor="middle" font-size="17" class="fill-neutral-700">{mk.label}</text>
			{/if}
		{/each}
	</g>

	<text x={(m.l + width - m.r) / 2} y={height - 12} text-anchor="middle" font-size="18" class="fill-neutral-700">{xLabel}</text>
	<text
		transform="translate(18 {(m.t + height - m.b) / 2}) rotate(-90)"
		text-anchor="middle"
		font-size="18"
		class="fill-neutral-700">{yLabel}</text
	>
</svg>
