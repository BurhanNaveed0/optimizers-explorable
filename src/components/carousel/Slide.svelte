<script>
	export let number;
	export let active = false;
</script>

<section
	class="relative h-full w-full shrink-0 overflow-auto px-[4%] py-[3%]"
	aria-hidden={!active}
	inert={!active ? true : undefined}
>
	<slot />
	<span class="absolute bottom-3 right-4 text-sm text-neutral-400">Slide {number}</span>
</section>
