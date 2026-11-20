<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import { ROUND_DATA, START, grad, fmt } from "$utils/optim.js";
	export let active;

	const xDomain = [5, 13];
	const yDomain = [-0.8, 5.2];
	const SCALE = 0.3; // arrow length per unit of gradient

	let pos = [...START];
	$: g = grad(pos, ROUND_DATA);
	$: arrows = [
		{ from: pos, to: [pos[0] - SCALE * g[0], pos[1]], color: "#ef4444", dash: "9 6" },
		{ from: pos, to: [pos[0], pos[1] - SCALE * g[1]], color: "#16a34a", dash: "9 6" },
		{ from: pos, to: [pos[0] - SCALE * g[0], pos[1] - SCALE * g[1]], color: "#3b82f6", width: 5 }
	];
</script>

<h2 class="slide-title">Use the gradient to find the way down</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Contour
			data={ROUND_DATA}
			{xDomain}
			{yDomain}
			levelAnchor={START}
			{arrows}
			markers={[{ theta: pos, color: "#3b82f6" }]}
			interactive
			on:pick={(e) => (pos = e.detail)}
		/>
	</div>
	<div class="flex flex-col justify-center gap-[1em]">
		<p>
			The <b>gradient</b> points in the direction where loss increases fastest, so we step in the
			<b>opposite</b> direction. It has one component per parameter:
		</p>
		<Legend
			items={[
				{ label: "−∂L/∂θ₀ part", color: "#ef4444", dash: "9 6" },
				{ label: "−∂L/∂θ₁ part", color: "#16a34a", dash: "9 6" },
				{ label: "−∇L (step direction)", color: "#3b82f6", width: 5 }
			]}
		/>
		<div class="panel">
			<p><Tex expr={`\\frac{\\partial L}{\\partial \\theta_0} = -\\tfrac{2}{n}\\textstyle\\sum_i r_i = ${fmt(g[0])}`} /></p>
			<p><Tex expr={`\\frac{\\partial L}{\\partial \\theta_1} = -\\tfrac{2}{n}\\textstyle\\sum_i r_i x_i = ${fmt(g[1])}`} /></p>
		</div>
		<div class="flex items-center gap-[1em]">
			<button class="btn" on:click={() => (pos = [...START])}>Reset</button>
			<span class="muted text-[0.9em] italic">Click or drag on the plot to move the point</span>
		</div>
	</div>
</div>
