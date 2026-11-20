<script>
	import { onMount } from "svelte";
	import { tab } from "$stores";

	const TABS = [
		{ id: "learn", label: "Learn" },
		{ id: "playground", label: "Playground" }
	];

	// Keep the tab in the URL hash so links like …/#playground work.
	function select(id) {
		tab.set(id);
		history.replaceState(null, "", `#${id}`);
	}
	function fromHash() {
		const id = location.hash.slice(1);
		if (TABS.some((t) => t.id === id)) tab.set(id);
	}
	onMount(fromHash);

	// Left/Right arrow keys move between tabs (standard tablist behaviour).
	function onKey(e, i) {
		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
		e.preventDefault();
		e.stopPropagation();
		const j = (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
		select(TABS[j].id);
		document.getElementById(`tab-${TABS[j].id}`)?.focus();
	}
</script>

<svelte:window on:hashchange={fromHash} />

<header class="sticky top-0 z-20 border-b border-neutral-400/60 bg-[#cfe0e3]/90 backdrop-blur">
	<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
		<h1 class="text-xl font-semibold text-neutral-800 sm:text-2xl">Optimizers Exploration Tool</h1>
		<nav role="tablist" aria-label="Sections" class="flex gap-1 rounded-lg bg-neutral-300/70 p-1">
			{#each TABS as t, i}
				<button
					id="tab-{t.id}"
					role="tab"
					aria-selected={$tab === t.id}
					aria-controls="panel-{t.id}"
					tabindex={$tab === t.id ? 0 : -1}
					class="rounded-md px-4 py-1.5 text-sm font-medium transition sm:text-base {$tab === t.id
						? 'bg-white text-neutral-900 shadow-sm'
						: 'text-neutral-600 hover:text-neutral-900'}"
					on:click={() => select(t.id)}
					on:keydown={(e) => onKey(e, i)}
				>
					{t.label}
				</button>
			{/each}
		</nav>
	</div>
</header>
