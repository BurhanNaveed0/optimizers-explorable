<script>
	// Free-form sandbox: pick a landscape, a start point and optimizer settings,
	// then compare the paths and loss curves.
	import Contour from "$components/viz/Contour.svelte";
	import LossChart from "$components/viz/LossChart.svelte";
	import StepControls from "$components/ui/StepControls.svelte";
	import { OPTIMIZERS, stretched, runAll, loss, fmt } from "$utils/optim.js";
	import { valleyView } from "$components/slides/q2.js";

	/** False while the Learn tab is showing (pauses playback). */
	export let visible = false;

	const KEYS = ["gd", "momentum", "adam"];
	// Learning-rate slider ranges (log scale), per optimizer.
	const LR_RANGE = { gd: [1e-3, 1], momentum: [1e-4, 0.1], adam: [1e-3, 2] };

	// --- State ------------------------------------------------------------
	let t = 1; // 0 = round bowl, 1 = narrow valley
	let steps = 40;
	let step = steps;
	let autoLR = true;
	let show = { gd: true, momentum: true, adam: true };
	let hp = structuredClone(stretched(t).hp);
	let start = stretched(t).start;
	let lastT = t;

	$: L = stretched(t);
	$: view = valleyView(L, t);

	// New landscape → new default start (the old one may be off-screen),
	// and tuned learning rates unless the viewer has taken over.
	$: if (t !== lastT) {
		lastT = t;
		start = L.start;
		if (autoLR) for (const k of KEYS) hp[k].lr = L.hp[k].lr;
		step = steps;
	}

	$: runs = runAll(start, L.data, steps, hp);
	$: paths = KEYS.filter((k) => show[k]).map((k) => ({
		points: runs[k].map((s) => s.theta),
		color: OPTIMIZERS[k].color,
		dash: OPTIMIZERS[k].dash,
		width: k === "adam" ? 5 : 4,
		dots: false,
		upTo: step
	}));
	$: startLoss = loss(start, L.data);
	$: series = KEYS.filter((k) => show[k]).map((k) => ({
		values: runs[k].map((s) => s.loss),
		color: OPTIMIZERS[k].color,
		dash: OPTIMIZERS[k].dash
	}));

	// Loss at the current step per optimizer (reactive, so the table updates).
	$: results = Object.fromEntries(
		KEYS.map((k) => {
			const v = runs[k][Math.min(step, steps)].loss;
			return [k, !Number.isFinite(v) || v > startLoss * 50 ? "diverged" : fmt(v, 3)];
		})
	);
	const fmtLR = (v) => +v.toPrecision(2);
	const fmtBeta2 = (v) => +v.toFixed(4);
	function setBeta2(logOneMinus) {
		hp.adam.beta2 = +(1 - 10 ** logOneMinus).toFixed(4);
		step = steps;
	}

	// --- Handlers -----------------------------------------------------------
	const toLog = (v) => Math.log10(v);
	const fromLog = (v) => 10 ** v;
	function setLR(k, logv) {
		autoLR = false;
		hp[k].lr = +fromLog(logv).toPrecision(2);
		step = steps;
	}
	function useTuned() {
		autoLR = true;
		hp = structuredClone(L.hp);
		step = steps;
	}
	function resetAll() {
		t = 1;
		steps = 40;
		show = { gd: true, momentum: true, adam: true };
		hp = structuredClone(stretched(1).hp);
		autoLR = true;
		start = stretched(1).start;
		step = steps;
	}
	function pick(e) {
		start = e.detail;
		step = steps;
	}
	$: if (step > steps) step = steps;
</script>

<div class="flex flex-1 justify-center px-4 py-6">
	<div class="slide-viewport w-full max-w-7xl rounded-2xl border border-neutral-400 bg-white p-4 shadow-sm sm:p-6">
		<div class="slide grid grid-cols-1 gap-[2em] lg:grid-cols-[1.7fr_1fr]">
			<!-- Visuals -->
			<div class="flex min-w-0 flex-col gap-[1em]">
				<div>
					<h2 class="slide-title !mb-[0.2em]">Playground</h2>
					<p class="muted">Click the plot to set a start point, then use the controls to change the landscape and each optimizer’s settings.</p>
				</div>
				<div class="aspect-[640/440] w-full">
					<Contour data={L.data} {...view} levelAnchor={L.start} nLevels={6} {paths} interactive on:pick={pick} />
				</div>
				<StepControls bind:step max={steps} active={visible} interval={Math.max(40, 3000 / steps)} />
				<div class="grid grid-cols-1 items-center gap-[1em] sm:grid-cols-[1.4fr_1fr]">
					<div class="aspect-[420/300] w-full"><LossChart {series} upTo={step} yMaxFixed={startLoss * 1.3} /></div>
					<table class="w-full text-left">
						<thead class="muted text-[0.85em]"><tr><th class="pb-[0.3em] font-normal">Loss at step {step}</th><th /></tr></thead>
						<tbody>
							{#each KEYS as k}
								<tr class={show[k] ? "" : "opacity-40"}>
									<td class="py-[0.15em]" style="color: {OPTIMIZERS[k].color}">{OPTIMIZERS[k].name}</td>
									<td class="text-right tabular-nums">{results[k]}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex flex-col gap-[1.2em]">
				<section class="panel">
					<h3 class="font-semibold">Landscape</h3>
					<input type="range" min="0" max="1" step="0.02" bind:value={t} aria-label="Landscape stretch" />
					<div class="muted flex justify-between text-[0.85em]">
						<button class="hover:underline" on:click={() => (t = 0)}>Round bowl</button>
						<button class="hover:underline" on:click={() => (t = 1)}>Narrow valley</button>
					</div>
				</section>

				<section class="panel">
					<div class="flex items-center justify-between gap-2">
						<h3 class="font-semibold">Optimizers</h3>
						<button class="btn text-[0.85em]" on:click={useTuned} disabled={autoLR}>Use tuned rates</button>
					</div>
					{#each KEYS as k}
						<div class="border-t border-neutral-300 pt-[0.6em]">
							<label class="flex items-center gap-[0.5em] font-medium" style="color: {OPTIMIZERS[k].color}">
								<input type="checkbox" bind:checked={show[k]} class="accent-current" />
								{OPTIMIZERS[k].name}
							</label>
							<label class="mt-[0.3em] flex flex-col">
								<span class="text-[0.9em]">Learning rate η = <b class="tabular-nums">{fmtLR(hp[k].lr)}</b></span>
								<input
									type="range"
									min={toLog(LR_RANGE[k][0])}
									max={toLog(LR_RANGE[k][1])}
									step="0.01"
									value={toLog(hp[k].lr)}
									on:input={(e) => setLR(k, +e.currentTarget.value)}
								/>
							</label>
							{#if k === "momentum"}
								<label class="flex flex-col">
									<span class="text-[0.9em]">β = <b class="tabular-nums">{hp.momentum.beta}</b></span>
									<input type="range" min="0" max="0.99" step="0.01" bind:value={hp.momentum.beta} on:input={() => (step = steps)} />
								</label>
							{:else if k === "adam"}
								<label class="flex flex-col">
									<span class="text-[0.9em]">β₁ = <b class="tabular-nums">{hp.adam.beta1}</b> <span class="muted">(first moment)</span></span>
									<input type="range" min="0" max="0.99" step="0.01" bind:value={hp.adam.beta1} on:input={() => (step = steps)} />
								</label>
								<!-- β₂ sits in 0.9–0.9999, so the slider works on −log10(1 − β₂) (1 → 0.9, 4 → 0.9999) -->
								<label class="flex flex-col">
									<span class="text-[0.9em]">β₂ = <b class="tabular-nums">{fmtBeta2(hp.adam.beta2)}</b> <span class="muted">(second moment)</span></span>
									<input
										type="range"
										min="1"
										max="4"
										step="0.05"
										value={-Math.log10(1 - hp.adam.beta2)}
										on:input={(e) => setBeta2(-e.currentTarget.value)}
										aria-label="Adam beta 2"
									/>
									<span class="muted text-[0.8em]">Lower β₂ adapts faster to recent gradient sizes.</span>
								</label>
							{/if}
						</div>
					{/each}
					<p class="muted text-[0.8em]">
						{autoLR
							? "Learning rates follow tuned defaults when you change the landscape."
							: "Using your learning rates. Try making one too large to see it diverge."}
					</p>
				</section>

				<section class="panel">
					<label class="flex flex-col">
						<span class="font-semibold">Steps: <span class="tabular-nums">{steps}</span></span>
						<input type="range" min="10" max="150" step="5" bind:value={steps} on:input={() => (step = steps)} />
					</label>
				</section>

				<div class="flex flex-wrap gap-[0.6em]">
					<button class="btn" on:click={() => ((start = L.start), (step = steps))}>Reset start point</button>
					<button class="btn" on:click={resetAll}>Reset everything</button>
				</div>
			</div>
		</div>
	</div>
</div>
