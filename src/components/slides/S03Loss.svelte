<script>
	import Scatter from "$components/viz/Scatter.svelte";
	import Tex from "$components/ui/Tex.svelte";
	import Legend from "$components/ui/Legend.svelte";
	import GuessSliders from "./GuessSliders.svelte";
	import { ROUND_DATA, residuals, loss, fmt } from "$utils/optim.js";
	import { guess } from "$stores";
	export let active;

	$: r = residuals($guess, ROUND_DATA);
	$: mse = loss($guess, ROUND_DATA);
	$: terms = r.map((v) => fmt(v * v, 1)).join(" + ");
</script>

<h2 class="slide-title">Measure the error: the loss function</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2em] md:grid-cols-[3fr_2fr]">
	<div class="min-h-0 md:h-full">
		<Scatter data={ROUND_DATA} xDomain={[-2, 2]} yDomain={[3, 14]} lines={[{ theta: $guess }]} residualsFor={$guess} />
	</div>
	<div class="flex flex-col gap-[1em]">
		<div class="panel">
			<p>Each point's <b>residual</b> is the observed value minus the prediction:</p>
			<p><Tex expr={"r_i = y_i - \\hat{y}_i"} /></p>
			<p>Average the squared residuals to get the <b>mean squared error</b>:</p>
			<p><Tex expr={"L(\\theta_0, \\theta_1) = \\tfrac{1}{n}\\textstyle\\sum_i r_i^2"} /></p>
			<p class="text-[0.85em] leading-snug text-neutral-600">= (1/10)({terms})</p>
			<p class="text-[1.25em]"><Tex expr={`\\text{MSE} = ${fmt(mse)}`} /></p>
		</div>
		<Legend items={[{ label: "residual", color: "#ef4444", dash: "6 5", width: 3 }]} />
		<GuessSliders />
	</div>
</div>
