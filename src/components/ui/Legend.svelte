<script>
	/** items: [{ label, color, dash?, width?, opacity? }] */
	export let items = [];
	export let row = false;
</script>

<ul class="flex {row ? 'flex-wrap justify-center gap-x-[2em] gap-y-[0.4em]' : 'flex-col gap-[0.5em]'}">
	{#each items as it}
		<li class="flex items-center gap-[0.6em]">
			<svg viewBox="0 0 40 10" class="h-[0.7em] w-[2.6em] shrink-0" aria-hidden="true">
				<line
					x1="2" y1="5" x2="38" y2="5"
					stroke={it.color}
					stroke-width={it.width ?? 4}
					stroke-dasharray={it.dash ?? ""}
					stroke-linecap={it.dash === "2 6" ? "round" : "butt"}
					opacity={it.opacity ?? 1}
				/>
			</svg>
			<span>{@html it.label}</span>
		</li>
	{/each}
</ul>
