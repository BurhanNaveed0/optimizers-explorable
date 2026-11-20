<script>
	import Contour from "$components/viz/Contour.svelte";
	import Scatter from "$components/viz/Scatter.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import { ROUND_DATA, START, SLIDE6_LR, runGD, fmt } from "$utils/optim.js";
	export let active;

	const STEPS = 3;
	const run = runGD(START, ROUND_DATA, STEPS, { lr: SLIDE6_LR });
	const points = run.map((s) => s.theta);
	let step = 0;

	$: cur = run[Math.min(step, STEPS)];
	$: prev = step > 0 ? run[step - 1] : null;
	$: lines = points.slice(0, step + 1).map((theta, i) => ({
		theta,
		opacity: i === step ? 1 : 0.15 + 0.2 * i,
		width: i === step ? 5 : 4
	}));
	const v = (a) => `\\begin{bmatrix}${fmt(a[0])}\\\\${fmt(a[1])}\\end{bmatrix}`;
</script>

<h2 class="slide-title">Gradient descent: step downhill</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[1.5em] md:grid-cols-2">
	<div class="min-h-0 md:h-full">
		<Contour
			data={ROUND_DATA}
			xDomain={[5, 13]}
			yDomain={[-0.8, 5.2]}
			levelAnchor={START}
			paths={[{ points, color: "#3b82f6", upTo: step, labels: true }]}
		/>
	</div>
	<figure class="flex min-h-0 flex-col">
		<figcaption class="text-center">The line gets better each step</figcaption>
		<div class="min-h-0 flex-1"><Scatter data={ROUND_DATA} xDomain={[-2, 2]} yDomain={[3, 14]} {lines} /></div>
	</figure>
</div>
<div class="mt-[0.8em] grid grid-cols-1 items-center gap-[1em] md:grid-cols-[3fr_2fr]">
	<div class="panel flex flex-wrap items-center gap-x-[1.5em]">
		<span><Tex expr={"\\theta \\leftarrow \\theta - \\eta\\,\\nabla L(\\theta)"} /></span>
		{#if prev}
			<span class="text-[0.95em]">
				<Tex expr={`\\text{step ${step}: } ${v(prev.theta)} - ${SLIDE6_LR}\\,${v(prev.grad)} = ${v(cur.theta)}`} />
			</span>
		{:else}
			<span class="muted">η = {SLIDE6_LR} (learning rate: how big each step is). Press Play.</span>
		{/if}
	</div>
	<div class="flex flex-col gap-[0.4em]">
		<StepControls bind:step max={STEPS} {active} interval={1100} />
		<span class="muted">loss: {fmt(cur.loss)}</span>
	</div>
</div>
