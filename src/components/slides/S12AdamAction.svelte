<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import { fmt } from "$utils/optim.js";
	import { STEPS, xDomain, yDomain, data, start, runs, pathFor, legendFor } from "./valley.js";
	export let active;

	let step = 0;
	$: s = runs.adam[step];
	$: ratio = s.stepSize[0] / s.stepSize[1];
	const v = (a, d = 2) => `\\begin{bmatrix}${fmt(a[0], d)}\\\\${fmt(a[1], d)}\\end{bmatrix}`;
</script>

<h2 class="slide-title">Adam in action</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour {data} {xDomain} {yDomain} levelAnchor={start} nLevels={6} paths={[pathFor("adam", runs.adam, { upTo: step })]} />
	</div>
	<div class="flex flex-col justify-center gap-[0.8em]">
		<Legend items={[legendFor("adam")]} />
		<div class="panel">
			<p class="font-semibold">Step {step}:</p>
			<p><Tex expr={`g = ${v(s.grad)}`} /></p>
			<p><Tex expr={`\\hat m = ${v(s.mHat)}`} />&ensp;<Tex expr={`\\hat v = ${v(s.vHat, 1)}`} /></p>
			<p>Step size <Tex expr={"\\eta/\\sqrt{\\hat v}"} />:</p>
			<p class="pl-[0.5em]">
				θ₀: <b class="tabular-nums">{fmt(s.stepSize[0], 3)}</b>&emsp; θ₁: <b class="tabular-nums">{fmt(s.stepSize[1], 3)}</b>
			</p>
			<p class="text-[0.9em]">θ₀ gets a <b>{fmt(ratio, 1)}×</b> larger step than θ₁.</p>
		</div>
		<p class="text-[0.95em]">
			θ₁'s gradients are large (the steep sides), so its steps shrink; θ₀'s are small (the shallow floor), so its
			steps grow. Adam <b>heads down the valley</b>.
		</p>
		<StepControls bind:step max={STEPS} {active} interval={220} />
		<span class="muted">loss: {fmt(s.loss)}</span>
	</div>
</div>
