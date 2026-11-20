<script>
	import Tex from "$components/ui/Tex.svelte";
	import { guess } from "$stores";
	import { START } from "$utils/optim.js";
</script>

<div class="flex flex-col gap-[0.8em]">
	<label class="flex flex-col gap-[0.3em]">
		<span><Tex expr={"\\theta_0"} /> (intercept)</span>
		<input type="range" min="2" max="14" step="0.05" bind:value={$guess[0]} />
	</label>
	<label class="flex flex-col gap-[0.3em]">
		<span><Tex expr={"\\theta_1"} /> (slope)</span>
		<input type="range" min="-2" max="5" step="0.05" bind:value={$guess[1]} />
	</label>
	<div class="flex items-center gap-[1em]">
		<button class="btn" on:click={() => guess.set([...START])}>Reset to initial guess</button>
		<span class="muted text-[0.9em] italic">Drag the sliders to move the line</span>
	</div>
</div>
