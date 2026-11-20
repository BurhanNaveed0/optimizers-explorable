<script>
	export let number;
	export let active = false;
</script>

<section
	class="slide relative flex h-full w-full shrink-0 flex-col overflow-auto px-[3.5%] pb-[3%] pt-[2.5%]"
	aria-hidden={!active}
	inert={!active ? true : undefined}
>
	<slot />
	<span class="pointer-events-none absolute bottom-[0.6em] right-[1em] text-[0.85em] text-neutral-400">
		Slide {number}
	</span>
</section>
