<script>
	import Surface3D from "$components/viz/Surface3D.svelte";
	import Contour from "$components/viz/Contour.svelte";
	import { ROUND_DATA, START, loss, fmt } from "$utils/optim.js";
	import { guess } from "$stores";
	export let active;

	const xDomain = [5, 13];
	const yDomain = [-0.8, 5.2];
</script>

<h2 class="slide-title">The loss landscape</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 gap-[1.5em] md:grid-cols-[1fr_1fr_0.75fr]">
	<figure class="flex min-h-0 flex-col">
		<figcaption class="mb-[0.3em] text-center text-[1.1em]">3D view</figcaption>
		<div class="min-h-0 flex-1">
			<Surface3D data={ROUND_DATA} {xDomain} {yDomain} zMax={22} point={$guess} />
		</div>
	</figure>
	<figure class="flex min-h-0 flex-col">
		<figcaption class="mb-[0.3em] text-center text-[1.1em]">Top-down (contour) view</figcaption>
		<div class="min-h-0 flex-1">
			<Contour
				width={500}
				height={460}
				data={ROUND_DATA}
				{xDomain}
				{yDomain}
				levelAnchor={START}
				markers={[{ theta: $guess, color: "#3b82f6", label: "your guess" }]}
			/>
		</div>
	</figure>
	<div class="flex flex-col justify-center gap-[1em]">
		<ul class="bullets">
			<li>Each pair (θ₀, θ₁) gives a different line, and each line has its own loss.</li>
			<li>Plotting the loss for <i>every</i> pair gives a surface: the <b>loss landscape</b>.</li>
			<li>For linear regression with MSE it's a bowl with a single lowest point.</li>
			<li><b>Goal:</b> find the bottom of the bowl <span class="text-amber-500">★</span>.</li>
		</ul>
		<p class="panel">Your guess: loss = {fmt(loss($guess, ROUND_DATA))}</p>
	</div>
</div>
