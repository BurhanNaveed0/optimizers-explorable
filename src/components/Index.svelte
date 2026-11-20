<script>
	import Header from "$components/Header.svelte";
	import Carousel from "$components/carousel/Carousel.svelte";
	import Playground from "$components/playground/Playground.svelte";
	import slides from "$components/slides";
	import { tab } from "$stores";
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<!-- Both panels stay mounted so each keeps its state when you switch tabs. -->
	<div id="panel-learn" role="tabpanel" aria-labelledby="tab-learn" class="flex-1 flex-col {$tab === 'learn' ? 'flex' : 'hidden'}">
		<Carousel {slides} visible={$tab === "learn"} />
	</div>
	<div id="panel-playground" role="tabpanel" aria-labelledby="tab-playground" class="flex-1 flex-col {$tab === 'playground' ? 'flex' : 'hidden'}">
		<Playground visible={$tab === "playground"} />
	</div>
</div>
