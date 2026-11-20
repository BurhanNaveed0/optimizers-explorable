<script>
	import Tex from "$components/ui/Tex.svelte";
	export let active;

	// A ball rolling down a slope and up the other side: it carries speed.
	let t = 0;
	let raf;
	$: if (active && !raf) loop();
	$: if (!active && raf) (cancelAnimationFrame(raf), (raf = null));
	function loop() {
		t += 0.016;
		raf = requestAnimationFrame(loop);
	}
	const W = 520, H = 260;
	const curve = (u) => H - 40 - 170 * u * u; // u in [-1, 1]
	const X = (u) => W / 2 + u * 230;
	const valley = Array.from({ length: 81 }, (_, i) => -1 + i / 40)
		.map((u, i) => `${i ? "L" : "M"}${X(u)},${curve(u)}`)
		.join("");
	// damped oscillation, like momentum settling into a minimum
	$: u = Math.cos(t * 2) * 0.85 * Math.exp(-0.12 * (t % 18));
</script>

<h2 class="slide-title">Momentum: the idea</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2em] md:grid-cols-2">
	<div class="flex flex-col gap-[1em]">
		<ul class="bullets">
			<li>Momentum uses information from <b>previous</b> gradients, not only the current one.</li>
			<li>
				It keeps a running <b>velocity</b> that smooths out zigzags and speeds up progress in directions that
				stay consistent.
			</li>
			<li>Like a ball rolling downhill: it builds up speed and doesn't change direction instantly.</li>
		</ul>
		<div class="panel text-[1.15em]">
			<p><Tex expr={"v_t = \\beta\\, v_{t-1} + \\nabla L(\\theta_t)"} /></p>
			<p><Tex expr={"\\theta_{t+1} = \\theta_t - \\eta\\, v_t"} /></p>
			<p class="text-[0.85em] text-neutral-600">
				β (often 0.9) controls how much past gradients carry forward. With β = 0 this is plain gradient
				descent.
			</p>
		</div>
	</div>
	<svg viewBox="0 0 {W} {H}" class="w-full" role="img" aria-label="A ball rolling in a valley">
		<path d={valley} fill="none" stroke="#222" stroke-width="3" />
		<circle cx={X(u)} cy={curve(u) - 16} r="15" fill="#ef4444" stroke="#222" stroke-width="1.5" />
	</svg>
</div>
