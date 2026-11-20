<script>
	import { onDestroy } from "svelte";

	/** Current step (bindable). */
	export let step = 0;
	export let max = 1;
	/** Whether the parent slide is showing; playback starts on first view. */
	export let active = false;
	export let interval = 650;
	export let label = "Step";

	let playing = false;
	let timer;
	let seen = false;

	function play() {
		if (step >= max) step = 0;
		playing = true;
		clearInterval(timer);
		timer = setInterval(() => {
			if (step >= max) return pause();
			step += 1;
		}, interval);
	}
	function pause() {
		playing = false;
		clearInterval(timer);
	}
	const prev = () => (pause(), (step = Math.max(0, step - 1)));
	const next = () => (pause(), (step = Math.min(max, step + 1)));
	const reset = () => (pause(), (step = 0));

	// Auto-play the first time the slide is shown; pause when leaving it.
	$: if (active && !seen) {
		seen = true;
		setTimeout(play, 400);
	}
	$: if (!active) pause();

	onDestroy(pause);
</script>

<div class="flex flex-wrap items-center gap-[0.5em]">
	<button class="btn" on:click={reset} disabled={step === 0} aria-label="Reset">⟲</button>
	<button class="btn" on:click={prev} disabled={step === 0} aria-label="Previous step">◀</button>
	<button class="btn min-w-[4.5em]" on:click={() => (playing ? pause() : play())}>
		{playing ? "Pause" : "Play"}
	</button>
	<button class="btn" on:click={next} disabled={step >= max} aria-label="Next step">▶</button>
	<span class="ml-[0.4em] tabular-nums text-neutral-600">{label} {step} / {max}</span>
</div>
