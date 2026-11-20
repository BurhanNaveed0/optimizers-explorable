<script>
	import Contour from "$components/viz/Contour.svelte";
	import LossChart from "$components/viz/LossChart.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import { LANDSCAPES, OPTIMIZERS, runAll, fmt } from "$utils/optim.js";
	import { STEPS, xDomain, yDomain, data, start as START, pathFor, legendFor } from "./valley.js";
	export let active;

	const keys = ["gd", "momentum", "adam"];
	let start = [...START];
	let lrScale = 1;
	let step = 0;

	$: hp = Object.fromEntries(
		keys.map((k) => [k, { ...LANDSCAPES.valley.hp[k], lr: LANDSCAPES.valley.hp[k].lr * lrScale }])
	);
	$: runs = runAll(start, data, STEPS, hp);
	$: paths = keys.map((k) => pathFor(k, runs[k], { upTo: step, dots: false }));
	$: series = keys.map((k) => ({
		values: runs[k].map((s) => s.loss),
		color: OPTIMIZERS[k].color,
		dash: OPTIMIZERS[k].dash
	}));

	function pick(e) {
		start = e.detail;
		step = STEPS;
	}
	function reset() {
		start = [...START];
		lrScale = 1;
		step = STEPS;
	}
</script>

<h2 class="slide-title">Side-by-side comparison</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[1.5em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour {data} {xDomain} {yDomain} levelAnchor={START} nLevels={6} {paths} interactive on:pick={pick} />
	</div>
	<div class="flex min-h-0 flex-col gap-[0.7em]">
		<p class="text-[0.95em]">Same start, same landscape: three noticeably different paths.</p>
		<div class="min-h-0 flex-1"><LossChart {series} upTo={step} /></div>
		<Legend items={keys.map((k) => legendFor(k))} />
		<label class="flex flex-col gap-[0.2em]">
			<span>Learning rate: <b>{fmt(lrScale, 2)}×</b> each optimizer's default</span>
			<input type="range" min="0.25" max="1.2" step="0.05" bind:value={lrScale} on:input={() => (step = STEPS)} />
		</label>
		<StepControls bind:step max={STEPS} {active} interval={140} />
		<div class="flex flex-wrap items-center gap-[0.8em]">
			<button class="btn" on:click={reset}>Reset</button>
			<span class="muted text-[0.85em] italic">Click the plot to pick a new start</span>
		</div>
	</div>
</div>
