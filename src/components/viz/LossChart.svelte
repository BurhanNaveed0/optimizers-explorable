<script>
	import { scaleLinear } from "d3";
	import { arrowHead } from "./arrow.js";

	/** [{ values: number[], color, dash?, label? }] */
	export let series = [];
	/** Draw only the first `upTo + 1` values (for animation). */
	export let upTo = null;
	export let width = 420;
	export let height = 300;

	const m = { t: 30, r: 16, b: 34, l: 50 };
	$: n = Math.max(...series.map((s) => s.values.length)) - 1;
	$: yMax = Math.max(...series.map((s) => s.values[0])) * 1.05;
	$: x = scaleLinear().domain([0, n]).range([m.l, width - m.r]);
	$: y = scaleLinear().domain([0, yMax]).range([height - m.b, m.t]).clamp(true);
	$: path = (vals) =>
		vals
			.slice(0, upTo == null ? undefined : upTo + 1)
			.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`)
			.join("");
</script>

<svg viewBox="0 0 {width} {height}" class="h-full w-full" role="img" aria-label="Loss versus step for each optimizer">
	<line x1={m.l} y1={height - m.b} x2={width - m.r} y2={height - m.b} stroke="#222" stroke-width="2.5" />
	<path d={arrowHead([m.l, height - m.b], [width - m.r + 2, height - m.b], 11)} fill="#222" />
	<line x1={m.l} y1={height - m.b} x2={m.l} y2={m.t - 8} stroke="#222" stroke-width="2.5" />
	<path d={arrowHead([m.l, height - m.b], [m.l, m.t - 10], 11)} fill="#222" />
	<text x={m.l - 8} y={m.t - 12} text-anchor="end" font-size="17" class="fill-neutral-700">loss</text>
	<text x={width - m.r} y={height - 6} text-anchor="end" font-size="17" class="fill-neutral-700">step</text>

	{#each series as s}
		<path
			d={path(s.values)}
			fill="none"
			stroke={s.color}
			stroke-width="3.5"
			stroke-dasharray={s.dash ?? ""}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/each}
</svg>
