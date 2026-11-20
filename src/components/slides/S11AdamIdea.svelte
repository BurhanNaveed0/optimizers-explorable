<script>
	import Tex from "$components/ui/Tex.svelte";
	export let active;
</script>

<h2 class="slide-title">Adam: the idea</h2>
<div class="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2em] md:grid-cols-[2fr_3fr]">
	<ul class="bullets text-[1.05em]">
		<li>
			Adam builds on Momentum: it keeps a running average of gradients, and adds an <b>adaptive step size
			for each parameter</b>.
		</li>
		<li>
			Parameters with consistently <b>large</b> gradients take <b>smaller</b> steps; parameters with small
			gradients take larger ones.
		</li>
		<li>This tackles the "one learning rate doesn't fit all" problem.</li>
	</ul>
	<div class="panel text-[1.1em]">
		<p><Tex expr={"m_t = \\beta_1 m_{t-1} + (1-\\beta_1)\\, g_t"} /> <span class="muted text-[0.85em]">average of gradients</span></p>
		<p><Tex expr={"v_t = \\beta_2 v_{t-1} + (1-\\beta_2)\\, g_t^2"} /> <span class="muted text-[0.85em]">average of squared gradients</span></p>
		<p>
			<Tex expr={"\\hat m_t = \\frac{m_t}{1-\\beta_1^t},\\quad \\hat v_t = \\frac{v_t}{1-\\beta_2^t}"} />
			<span class="muted text-[0.85em]">bias correction</span>
		</p>
		<p><Tex expr={"\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat v_t} + \\varepsilon}\\, \\hat m_t"} /></p>
		<p class="text-[0.8em] text-neutral-600">
			Common defaults: <Tex expr={"\\beta_1 = 0.9,\\ \\beta_2 = 0.999,\\ \\varepsilon = 10^{-8}"} />. The
			fraction <Tex expr={"\\eta / (\\sqrt{\\hat v_t}+\\varepsilon)"} /> is each parameter's own step size.
		</p>
	</div>
</div>
