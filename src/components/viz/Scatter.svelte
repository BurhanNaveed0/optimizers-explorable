<script>
	import { scaleLinear } from "d3";
	import { predict } from "$utils/optim.js";
	import { arrowHead } from "./arrow.js";

	/** [[x, y], ...] */
	export let data = [];
	/** Lines to draw: [{ theta, color?, width?, opacity? }] */
	export let lines = [];
	/** If set, draw dashed residuals from each point to this line. */
	export let residualsFor = null;
	export let xDomain = [-2, 2];
	export let yDomain = [0, 15];
	export let width = 600;
	export let height = 420;

	const m = { t: 24, r: 24, b: 40, l: 36 };
	$: x = scaleLinear().domain(xDomain).range([m.l, width - m.r]);
	$: y = scaleLinear().domain(yDomain).range([height - m.b, m.t]);
	$: x0 = xDomain[0] + (xDomain[1] - xDomain[0]) * 0.03;
	$: x1 = xDomain[1] - (xDomain[1] - xDomain[0]) * 0.03;

	const axis = "#222";
	const clipId = `scatter-clip-${Math.random().toString(36).slice(2)}`;
</script>

<svg viewBox="0 0 {width} {height}" class="h-full w-full" role="img" aria-label="Scatter plot of the dataset">
	<defs>
		<clipPath id={clipId}><rect x={m.l} y={m.t} width={width - m.l - m.r} height={height - m.t - m.b} /></clipPath>
	</defs>

	<!-- Axes -->
	<line x1={m.l} y1={height - m.b} x2={width - m.r + 8} y2={height - m.b} stroke={axis} stroke-width="2.5" />
	<path d={arrowHead([m.l, height - m.b], [width - m.r + 10, height - m.b], 11)} fill={axis} />
	<line x1={m.l} y1={height - m.b} x2={m.l} y2={m.t - 8} stroke={axis} stroke-width="2.5" />
	<path d={arrowHead([m.l, height - m.b], [m.l, m.t - 10], 11)} fill={axis} />
	<text x={width - m.r} y={height - 10} text-anchor="middle" class="fill-neutral-700" font-size="18">x</text>
	<text x={m.l - 20} y={m.t + 4} class="fill-neutral-700" font-size="18">y</text>

	<g clip-path="url(#{clipId})">
		<!-- Residuals -->
		{#if residualsFor}
			{#each data as [dx, dy]}
				<line
					x1={x(dx)} y1={y(dy)} x2={x(dx)} y2={y(predict(residualsFor, dx))}
					stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 5"
				/>
			{/each}
		{/if}

		<!-- Fitted lines -->
		{#each lines as l}
			<line
				x1={x(x0)} y1={y(predict(l.theta, x0))} x2={x(x1)} y2={y(predict(l.theta, x1))}
				stroke={l.color ?? "#3b82f6"} stroke-width={l.width ?? 5} opacity={l.opacity ?? 1}
				stroke-linecap="round"
			/>
		{/each}
	</g>

	<!-- Points -->
	{#each data as [dx, dy]}
		<circle cx={x(dx)} cy={y(dy)} r="8" fill="#222" />
	{/each}
</svg>
