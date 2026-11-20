<script>
	import Contour from "$components/viz/Contour.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import { stretched, runAll } from "$utils/optim.js";
	import { STEPS, pathFor, legendFor } from "./valley.js";
	import { roundView, valleyView } from "./q2.js";
	export let active;

	const keys = ["gd", "momentum", "adam"];
	const L = stretched(0);
	const Lruns = runAll(L.start, L.data, STEPS, L.hp);
	const Lpaths = keys.map((k) => pathFor(k, Lruns[k], { dots: false }));

	let t = 1;
	$: R = stretched(t);
	$: Rruns = runAll(R.start, R.data, STEPS, R.hp);
	$: Rpaths = keys.map((k) => pathFor(k, Rruns[k], { dots: false }));
</script>

<h2 class="slide-title">Q2: When do the optimizers disagree?</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[1.5em] md:grid-cols-[2fr_1fr]">
	<div class="flex min-h-0 flex-col justify-center gap-[0.6em]">
		<div class="grid min-h-0 grid-cols-1 gap-[1em] sm:grid-cols-2">
			<figure class="flex min-h-0 flex-col">
				<figcaption class="text-center">Round bowl: similar paths</figcaption>
				<div class="min-h-0 flex-1"><Contour width={500} height={460} data={L.data} {...roundView(L)} levelAnchor={L.start} paths={Lpaths} /></div>
			</figure>
			<figure class="flex min-h-0 flex-col">
				<figcaption class="text-center">{t > 0.6 ? "Narrow valley: paths split" : "Stretch it…"}</figcaption>
				<div class="min-h-0 flex-1">
					<Contour width={500} height={460} data={R.data} {...valleyView(R, t)} levelAnchor={R.start} nLevels={6} paths={Rpaths} />
				</div>
			</figure>
		</div>
		<label class="flex flex-col gap-[0.2em] sm:ml-[calc(50%+0.5em)]">
			<span>Stretch the bowl (right plot)</span>
			<input type="range" min="0" max="1" step="0.02" bind:value={t} />
		</label>
		<Legend row items={keys.map((k) => legendFor(k))} />
	</div>
	<ul class="bullets self-center text-[0.85em]">
		<li>
			<b>Narrow or stretched valleys:</b> GD zigzags, Momentum smooths the path but can overshoot, Adam's
			per-parameter scaling heads more directly to the minimum.
		</li>
		<li>
			<b>Parameters on very different scales:</b> one learning rate favors one parameter over the other in GD and
			Momentum; Adam sizes each step separately.
		</li>
		<li><b>Large learning rates:</b> Momentum can overshoot and circle the minimum; GD may oscillate or diverge.</li>
		<li>
			<b>Flat regions / plateaus:</b> tiny gradients slow GD to a crawl. Momentum keeps the speed it has built up,
			and Adam scales small gradients up.
		</li>
		<li><b>When they agree:</b> on a round, well-scaled bowl with a modest learning rate, all three follow similar paths.</li>
	</ul>
</div>
