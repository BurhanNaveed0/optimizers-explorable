<script>
	import { scaleLinear } from "d3";
	import Tex from "$components/ui/Tex.svelte";

	export let active;

	// Demo data + interactive line (state persists across slide changes)
	const data = [
		[1, 3], [2, 4.5], [3, 4.7], [4, 6.2], [5, 6.4],
		[6, 7.4], [7, 7.6], [8, 8.4], [9, 9.6], [10, 9.8]
	];
	let theta0 = 6.5;
	let theta1 = 0.15;

	const W = 600, H = 400, m = { t: 20, r: 20, b: 40, l: 40 };
	const x = scaleLinear().domain([0, 11]).range([m.l, W - m.r]);
	const y = scaleLinear().domain([0, 12]).range([H - m.b, m.t]);
	const f = (xv) => theta0 + theta1 * xv;
</script>

<h2 class="mb-4 text-3xl text-neutral-800">Make an initial guess</h2>

<div class="grid grid-cols-1 items-center gap-6 md:h-[85%] md:grid-cols-[3fr_2fr] md:gap-8">
	<svg viewBox="0 0 {W} {H}" class="w-full md:h-full">
		<defs>
			<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
				<path d="M0 0 10 5 0 10z" fill="#222" />
			</marker>
		</defs>
		<line x1={m.l} y1={H - m.b} x2={W - m.r} y2={H - m.b} stroke="#222" stroke-width="2" marker-end="url(#arrow)" />
		<line x1={m.l} y1={H - m.b} x2={m.l} y2={m.t} stroke="#222" stroke-width="2" marker-end="url(#arrow)" />
		<text x={W - m.r} y={H - 10} text-anchor="end" class="fill-neutral-700 text-sm">x</text>
		<text x={m.l - 20} y={m.t + 10} class="fill-neutral-700 text-sm">y</text>

		<line x1={x(0.5)} y1={y(f(0.5))} x2={x(10.5)} y2={y(f(10.5))} stroke="#3b82f6" stroke-width="4" />
		{#each data as [dx, dy]}
			<circle cx={x(dx)} cy={y(dy)} r="6" fill="#222" />
		{/each}
	</svg>

	<div class="flex flex-col gap-6">
		<div class="rounded-md border border-neutral-300 bg-neutral-100 p-4 text-lg">
			<Tex expr={"\\hat{y} = \\theta_0 + \\theta_1 x"} />
			<div class="mt-2"><Tex expr={`\\theta_0 = ${theta0.toFixed(2)}`} /> (intercept)</div>
			<div class="mt-2"><Tex expr={`\\theta_1 = ${theta1.toFixed(2)}`} /> (slope)</div>
		</div>
		<label class="flex flex-col gap-2">
			<span><Tex expr={"\\theta_0"} /> slider</span>
			<input type="range" min="0" max="10" step="0.1" bind:value={theta0} class="accent-blue-500" />
		</label>
		<label class="flex flex-col gap-2">
			<span><Tex expr={"\\theta_1"} /> slider</span>
			<input type="range" min="-1" max="2" step="0.01" bind:value={theta1} class="accent-blue-500" />
		</label>
	</div>
</div>
