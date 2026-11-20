<script>
	import Scatter from "$components/viz/Scatter.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import GuessSliders from "./GuessSliders.svelte";
	import { ROUND_DATA, fmt } from "$utils/optim.js";
	import { guess } from "$stores";
	export let active;
</script>

<h2 class="slide-title">Make an initial guess</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Scatter data={ROUND_DATA} xDomain={[-2, 2]} yDomain={[3, 14]} lines={[{ theta: $guess }]} />
	</div>
	<div class="flex flex-col gap-[1.2em]">
		<div class="panel text-[1.15em]">
			<p><Tex expr={"\\hat{y} = \\theta_0 + \\theta_1 x"} /></p>
			<p><Tex expr={`\\theta_0 = ${fmt($guess[0])}`} /> (intercept)</p>
			<p><Tex expr={`\\theta_1 = ${fmt($guess[1])}`} /> (slope)</p>
		</div>
		<p class="muted">
			Our line has two parameters. We start by picking values for both, and this first guess almost certainly
			fits the data poorly.
		</p>
		<GuessSliders />
	</div>
</div>
