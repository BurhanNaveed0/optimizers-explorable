<script>
	export let active;
	const cards = [
		{ name: "Gradient descent", color: "#3b82f6", text: "Step against the current gradient with one fixed learning rate.", note: "covered" },
		{ name: "Momentum", color: "#ef4444", text: "Remember past gradients to smooth the path and build up speed.", note: "slides 9–10" },
		{ name: "Adam", color: "#16a34a", text: "Momentum, plus a separate, adaptive step size for every parameter.", note: "slides 11–12" }
	];
</script>

<h2 class="slide-title">Better optimizers</h2>
<div class="flex min-h-0 flex-1 flex-col justify-center gap-[2em]">
	<p class="text-[1.15em]">
		Zigzagging and a one-size-fits-all learning rate motivate smarter update rules. Next we'll see how two of
		them change the optimizer's path, and how quickly each one reduces the loss.
	</p>
	<div class="grid grid-cols-1 items-stretch gap-[1em] md:grid-cols-[1fr_auto_1fr_auto_1fr]">
		{#each cards as c, i}
			{#if i > 0}<div class="hidden self-center text-[2em] text-neutral-400 md:block">→</div>{/if}
			<div class="panel border-l-[0.4em]" style="border-left-color: {c.color}">
				<p class="text-[1.3em] font-semibold" style="color: {c.color}">{c.name}</p>
				<p>{c.text}</p>
				<p class="muted text-[0.9em]">{c.note}</p>
			</div>
		{/each}
	</div>
	<p class="muted">Then we compare all three side by side and answer two conceptual questions.</p>
</div>
