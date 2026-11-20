<script>
	import katex from "katex";

	export let expr;
	export let display = false;
</script>

<span class={display ? "my-3 block" : ""}>
	{@html katex.renderToString(expr, { displayMode: display, throwOnError: false })}
</span>
