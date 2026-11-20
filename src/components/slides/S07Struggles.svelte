<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import { fmt } from "$utils/optim.js";
	import { STEPS, xDomain, yDomain, data, start, runs, pathFor, legendFor } from "./valley.js";
	export let active;
	let step = 0;
</script>

<h2 class="slide-title">Problem: zigzagging in a narrow valley</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour {data} {xDomain} {yDomain} levelAnchor={start} nLevels={6} paths={[pathFor("gd", runs.gd, { upTo: step })]} />
	</div>
	<div class="flex flex-col justify-center gap-[1em]">
		<Legend items={[legendFor("gd")]} />
		<div class="panel">
			<p>Same model, same loss, but now <i>x</i> isn't centered or scaled (it runs from −12 to 6).</p>
			<p>That stretches the bowl into a <b>long, narrow valley</b>.</p>
		</div>
		<ul class="bullets">
			<li>Gradient descent <b>bounces across the steep sides</b> and <b>crawls along the valley floor</b>.</li>
			<li>
				One learning rate can't suit both directions: any bigger and it overshoots the steep sides; any
				smaller and progress along the floor stalls.
			</li>
		</ul>
		<StepControls bind:step max={STEPS} {active} interval={180} />
		<span class="muted">loss: {fmt(runs.gd[step].loss)}</span>
	</div>
</div>
