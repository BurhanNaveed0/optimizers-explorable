<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import { fmt } from "$utils/optim.js";
	import { STEPS, xDomain, yDomain, data, start, runs, pathFor, screenArrow, screenAngle, Q1_STEP } from "./valley.js";
	export let active;

	let k = Q1_STEP;
	$: s = runs.momentum[k];
	$: arrows = [
		{ ...screenArrow(s.theta, [-s.grad[0], -s.grad[1]]), color: "#3b82f6", width: 5 },
		{ ...screenArrow(s.theta, s.update), color: "#ef4444", width: 5 }
	];
	$: angle = screenAngle(s.update, [-s.grad[0], -s.grad[1]]);
</script>

<h2 class="slide-title">Q1: Why not follow the negative gradient?</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour
			{data}
			{xDomain}
			{yDomain}
			levelAnchor={start}
			nLevels={6}
			paths={[pathFor("momentum", runs.momentum, { opacity: 0.35, dots: false, startOpacity: 0.4 })]}
			{arrows}
			markers={[{ theta: s.theta, color: "#222", r: 8 }]}
		/>
	</div>
	<div class="flex flex-col justify-center gap-[0.9em]">
		<Legend
			items={[
				{ label: "−∇L (plain GD step)", color: "#3b82f6", width: 5 },
				{ label: "Momentum's actual step", color: "#ef4444", width: 5 }
			]}
		/>
		<ul class="bullets text-[0.95em]">
			<li>In plain GD the update is <i>always</i> −η∇L: the gradient is the only term.</li>
			<li>
				<b>Momentum</b> adds velocity built from past gradients, so it keeps moving the way it was going even
				after the gradient turns around.
			</li>
			<li><b>Adam</b> also rescales each parameter separately, which rotates the update away from −∇L.</li>
		</ul>
		<label class="flex flex-col gap-[0.2em]">
			<span>Momentum step <b>{k}</b>: arrows differ by <b>{fmt(angle, 0)}°</b></span>
			<input type="range" min="0" max={STEPS} step="1" bind:value={k} />
		</label>
		<button class="btn self-start" on:click={() => (k = Q1_STEP)}>Back to the overshoot</button>
	</div>
</div>
