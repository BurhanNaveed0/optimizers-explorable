<script>
	export let number = undefined; // kept so callers needn't change
	export let active = false;
</script>

<section
	class="slide relative flex h-full w-full shrink-0 flex-col overflow-auto px-[3.5%] pb-[3%] pt-[2.5%]"
	aria-hidden={!active}
	inert={!active ? true : undefined}
>
	<slot />
</section>
