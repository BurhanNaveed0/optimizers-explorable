<script>
	// A lightweight 3D wireframe of the loss surface, drawn in SVG.
	// Drag to rotate. No WebGL needed: the surface is a smooth bowl, so a
	// simple rotate-and-project of a grid is enough.
	import { loss, minimum } from "$utils/optim.js";
	import { starPoints } from "./arrow.js";

	export let data;
	export let xDomain;
	export let yDomain;
	/** Loss values above this are cut off (the rim of the bowl). */
	export let zMax = 20;
	/** Point to mark on the surface (e.g. the current guess). */
	export let point = null;
	export let width = 600;
	export let height = 460;

	let yaw = -0.6;
	let pitch = 0.42;

	const N = 26;
	$: min = minimum(data);
	$: cx = (xDomain[0] + xDomain[1]) / 2;
	$: cy = (yDomain[0] + yDomain[1]) / 2;
	$: hx = (xDomain[1] - xDomain[0]) / 2;
	$: hy = (yDomain[1] - yDomain[0]) / 2;

	const S = 175; // screen scale
	const H = 1.5; // height of bowl in model units

	function project(u, v, w) {
		const xr = u * Math.cos(yaw) - v * Math.sin(yaw);
		const depth = u * Math.sin(yaw) + v * Math.cos(yaw);
		const up = w * Math.cos(pitch) + depth * Math.sin(pitch);
		return [width / 2 + xr * S, height * 0.72 - up * S];
	}
	const toUVW = (t0, t1, L) => [(t0 - cx) / hx, (t1 - cy) / hy, (Math.min(L, zMax) / zMax) * H];
	const P = (t0, t1, L) => project(...toUVW(t0, t1, L));

	// Grid polylines, broken where the surface goes above zMax.
	$: lines = (yaw, pitch, data, (() => {
		const out = [];
		const build = (fixedIsU) => {
			for (let a = 0; a <= N; a++) {
				let seg = [];
				for (let b = 0; b <= N * 2; b++) {
					const s = -1 + (2 * a) / N;
					const r = -1 + b / N;
					const u = fixedIsU ? s : r;
					const v = fixedIsU ? r : s;
					const t0 = cx + u * hx,
						t1 = cy + v * hy;
					const L = loss([t0, t1], data);
					if (L <= zMax) seg.push(project(u, v, (L / zMax) * H));
					else if (seg.length) (out.push(seg), (seg = []));
				}
				if (seg.length > 1) out.push(seg);
			}
		};
		build(true);
		build(false);
		return out.map((seg) => seg.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(""));
	})());

	$: pMin = (yaw, pitch, P(min[0], min[1], loss(min, data)));
	$: pPt = point && (yaw, pitch, P(point[0], point[1], loss(point, data)));
	$: pFloor = point && (yaw, pitch, project(...toUVW(point[0], point[1], 0).slice(0, 2), 0));
	$: axes = (yaw, pitch, {
		o: project(-1, -1, 0),
		u: project(1.15, -1, 0),
		v: project(-1, 1.15, 0),
		w: project(-1, -1, H * 1.1)
	});

	// Drag to rotate
	let drag = null;
	function down(e) {
		drag = { x: e.clientX, y: e.clientY, yaw, pitch };
		e.currentTarget.setPointerCapture?.(e.pointerId);
	}
	function move(e) {
		if (!drag) return;
		yaw = drag.yaw + (e.clientX - drag.x) * 0.01;
		pitch = Math.min(1.45, Math.max(0.05, drag.pitch + (e.clientY - drag.y) * 0.006));
	}
	const up = () => (drag = null);
</script>

<svg
	viewBox="0 0 {width} {height}"
	class="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
	role="img"
	aria-label="3D view of the loss surface. Drag to rotate."
	on:pointerdown={down}
	on:pointermove={move}
	on:pointerup={up}
	on:pointercancel={up}
>
	<!-- axes -->
	<g stroke="#222" stroke-width="2">
		<line x1={axes.o[0]} y1={axes.o[1]} x2={axes.u[0]} y2={axes.u[1]} />
		<line x1={axes.o[0]} y1={axes.o[1]} x2={axes.v[0]} y2={axes.v[1]} />
		<line x1={axes.o[0]} y1={axes.o[1]} x2={axes.w[0]} y2={axes.w[1]} />
	</g>
	<g font-size="17" class="fill-neutral-700">
		<text x={axes.u[0]} y={axes.u[1] + 20} text-anchor="middle">θ₀</text>
		<text x={axes.v[0]} y={axes.v[1] + 20} text-anchor="middle">θ₁</text>
		<text x={axes.w[0] + 8} y={axes.w[1]}>loss</text>
	</g>

	{#each lines as d}
		<path {d} fill="none" stroke="#9ca3af" stroke-width="1.3" />
	{/each}

	<polygon points={starPoints(pMin[0], pMin[1], 14)} fill="#fbbf24" stroke="#222" stroke-width="1.5" />

	{#if point}
		<line x1={pPt[0]} y1={pPt[1]} x2={pFloor[0]} y2={pFloor[1]} stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 4" />
		<circle cx={pPt[0]} cy={pPt[1]} r="10" fill="#3b82f6" stroke="#222" stroke-width="1.5" />
	{/if}

	<text x={width - 8} y={height - 8} text-anchor="end" font-size="15" class="fill-neutral-400">drag to rotate</text>
</svg>
