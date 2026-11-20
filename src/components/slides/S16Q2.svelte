<script>
	import Contour from "$components/viz/Contour.svelte";
	import { stretched } from "$utils/optim.js";
	import { roundView, valleyView } from "./q2.js";
	export let active;

	const L = stretched(0);
	const R = stretched(1);
</script>

<h2 class="slide-title">Conceptual question #2</h2>
<p class="panel mb-[1em] text-[1.3em] font-semibold">
	Under what conditions do the optimizers behave noticeably differently?
</p>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[1.5em] md:grid-cols-[1fr_1fr_0.8fr]">
	<figure class="flex min-h-0 flex-col">
		<figcaption class="text-center">Round, well-scaled bowl</figcaption>
		<div class="min-h-0 flex-1">
			<Contour width={500} height={460} data={L.data} {...roundView(L)} levelAnchor={L.start} markers={[{ theta: L.start, color: "#9ca3af" }]} />
		</div>
	</figure>
	<figure class="flex min-h-0 flex-col">
		<figcaption class="text-center">Narrow, poorly scaled valley</figcaption>
		<div class="min-h-0 flex-1">
			<Contour width={500} height={460} data={R.data} {...valleyView(R, 1)} levelAnchor={R.start} nLevels={6} markers={[{ theta: R.start, color: "#9ca3af" }]} />
		</div>
	</figure>
	<div class="flex flex-col justify-center gap-[0.8em]">
		<p>Predict: if GD, Momentum and Adam all start from the grey dot, on which landscape will their paths look alike?</p>
		<p class="muted">Also think about: a very large learning rate, and flat regions where the gradient is tiny.</p>
	</div>
</div>
