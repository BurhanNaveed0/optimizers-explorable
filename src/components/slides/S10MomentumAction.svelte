<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import { fmt, LANDSCAPES } from "$utils/optim.js";
	import { STEPS, xDomain, yDomain, data, start, runs, pathFor, legendFor } from "./valley.js";
	export let active;

	const { lr, beta } = LANDSCAPES.valley.hp.momentum;
	let step = 0;
	$: s = runs.momentum[step];
	const v = (a) => `\\begin{bmatrix}${fmt(a[0])}\\\\${fmt(a[1])}\\end{bmatrix}`;
</script>

<h2 class="slide-title">Momentum in action</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour
			{data}
			{xDomain}
			{yDomain}
			levelAnchor={start}
			nLevels={6}
			paths={[
				pathFor("gd", runs.gd, { color: "#bfdbfe", dots: false, startDot: false }),
				pathFor("momentum", runs.momentum, { upTo: step })
			]}
		/>
	</div>
	<div class="flex flex-col justify-center gap-[0.9em]">
		<Legend items={[legendFor("gd", { color: "#bfdbfe" }), legendFor("momentum")]} />
		<div class="panel">
			<p class="font-semibold">Step {step}:</p>
			<p><Tex expr={`g = \\nabla L = ${v(s.grad)}`} /></p>
			<p><Tex expr={`v = ${beta}\\,${v(s.vPrev)} + g = ${v(s.v)}`} /></p>
			<p><Tex expr={`\\Delta\\theta = -${lr}\\, v = ${v(s.update)}`} /></p>
		</div>
		<p>Smoother path that picks up speed along the valley floor. It can <b>overshoot</b>, though.</p>
		<StepControls bind:step max={STEPS} {active} interval={220} />
		<span class="muted">loss: {fmt(s.loss)} (gradient descent at this step: {fmt(runs.gd[step].loss)})</span>
	</div>
</div>
