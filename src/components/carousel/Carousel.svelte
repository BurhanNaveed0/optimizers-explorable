<script>
	import { currentSlide } from "$stores";
	import Slide from "./Slide.svelte";

	/** Array of Svelte components, one per slide. */
	export let slides = [];
	/** False while another tab is showing: pauses slides and ignores arrow keys. */
	export let visible = true;

	$: total = slides.length;
	$: index = Math.min(Math.max($currentSlide, 0), Math.max(total - 1, 0));

	function go(i) {
		currentSlide.set(Math.min(Math.max(i, 0), total - 1));
	}
	const prev = () => go(index - 1);
	const next = () => go(index + 1);

	function onKeydown(e) {
		// Don't hijack arrow keys while the user is dragging a slider or typing.
		if (!visible) return;
		const tag = e.target?.tagName;
		if (e.target?.getAttribute?.("role") === "tab") return;
		if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
		if (e.key === "ArrowLeft") prev();
		else if (e.key === "ArrowRight") next();
	}
</script>

<svelte:window on:keydown={onKeydown} />

<div class="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
	<!-- Device frame -->
	<!-- Width is capped by the window height too, so the whole slide fits on screen -->
	<div
		class="w-full rounded-[2.5rem] border-2 border-neutral-500 bg-neutral-300 p-4 sm:p-10"
		style="max-width: min(72rem, calc((100vh - 18rem) * 16 / 9 + 5rem))"
	>
		<!-- Viewport: all slides stay mounted so interactive state survives navigation -->
		<div class="slide-viewport relative h-[80vh] w-full overflow-hidden rounded-[1.75rem] border border-neutral-400 bg-white shadow-inner md:aspect-[16/9] md:h-auto">
			<div
				class="flex h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
				style="transform: translateX(-{index * 100}%)"
			>
				{#each slides as component, i}
					<Slide number={i + 1} active={visible && i === index}>
						<svelte:component this={component} active={visible && i === index} />
					</Slide>
				{/each}
			</div>
		</div>
	</div>

	<!-- Controls -->
	<nav class="flex flex-col items-center gap-3" aria-label="Slide navigation">
		<div class="flex items-center gap-8">
			<button class="nav-btn" on:click={prev} disabled={index === 0} aria-label="Previous slide">
				<svg viewBox="0 0 24 24" class="h-10 w-10"><path d="M10 5 3 12l7 7v-4h11V9H10z" /></svg>
			</button>
			<span class="min-w-[4ch] text-center text-4xl tabular-nums text-neutral-700" aria-live="polite">
				{index + 1}/{total}
			</span>
			<button class="nav-btn" on:click={next} disabled={index === total - 1} aria-label="Next slide">
				<svg viewBox="0 0 24 24" class="h-10 w-10"><path d="M14 5l7 7-7 7v-4H3V9h11z" /></svg>
			</button>
		</div>

		<!-- Progress dots (click to jump) -->
		<div class="flex flex-wrap justify-center gap-2">
			{#each slides as _, i}
				<button
					class="h-2.5 rounded-full transition-all {i === index
						? 'w-6 bg-neutral-700'
						: 'w-2.5 bg-neutral-400 hover:bg-neutral-500'}"
					on:click={() => go(i)}
					aria-label="Go to slide {i + 1}"
					aria-current={i === index ? "step" : undefined}
				/>
			{/each}
		</div>
	</nav>
</div>

<style>
	.nav-btn {
		@apply rounded-md p-1 transition;
	}
	.nav-btn svg {
		fill: theme("colors.neutral.500");
		stroke: theme("colors.neutral.700");
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.nav-btn:not(:disabled):hover svg {
		fill: theme("colors.neutral.600");
	}
	.nav-btn:disabled {
		@apply cursor-not-allowed opacity-30;
	}
</style>
