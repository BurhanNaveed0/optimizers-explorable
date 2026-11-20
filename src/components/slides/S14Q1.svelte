<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import { xDomain, yDomain, data, start, runs, pathFor, screenArrow, Q1_STEP } from "./valley.js";
	export let active;

	const s = runs.momentum[Q1_STEP];
	const gArrow = { ...screenArrow(s.theta, [-s.grad[0], -s.grad[1]]), color: "#3b82f6", width: 5 };
</script>

<h2 class="slide-title">Conceptual question #1</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour
			{data}
			{xDomain}
			{yDomain}
			levelAnchor={start}
			nLevels={6}
			paths={[pathFor("momentum", runs.momentum, { upTo: Q1_STEP, opacity: 0.35, dots: false, startOpacity: 0.4 })]}
			arrows={[gArrow]}
			markers={[{ theta: s.theta, color: "#222", r: 8 }]}
		/>
	</div>
	<div class="flex flex-col justify-center gap-[1.2em]">
		<p class="panel text-[1.35em] font-semibold leading-snug">
			Why might an optimizer's update point somewhere <i>other</i> than the negative gradient?
		</p>
		<p>
			Momentum has just passed the bottom of the valley. The negative gradient (blue) now points back the way it
			came.
		</p>
		<Legend items={[{ label: "−∇L (where plain GD would step)", color: "#3b82f6", width: 5 }]} />
		<p class="muted">Which way will Momentum's next step go? Think about what the velocity <i>v</i> remembers, then go to the next slide.</p>
	</div>
</div>
