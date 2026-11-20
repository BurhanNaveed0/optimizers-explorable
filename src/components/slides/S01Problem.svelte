<script>
	import Scatter from "$components/viz/Scatter.svelte";
	import { ROUND_DATA } from "$utils/optim.js";
	export let active;
</script>

<h2 class="slide-title">The problem: find the best line</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full"><Scatter data={ROUND_DATA} xDomain={[-2, 2]} yDomain={[3, 14]} /></div>
	<div class="flex flex-col gap-[1.2em]">
		<div class="panel text-[1.15em]">
			<p>We have a dataset of points <i>(x, y)</i>.</p>
			<p><b>Goal:</b> draw the line that predicts <i>y</i> from <i>x</i> as closely as possible.</p>
		</div>
		<p class="muted">
			"Best" means the line whose predictions are closest to the real data. The rest of this explorable is about
			how a computer can <i>find</i> that line on its own.
		</p>
	</div>
</div>
