/** SVG path for a triangular arrowhead at `to`, pointing away from `from`. */
export function arrowHead([x1, y1], [x2, y2], size = 12) {
	const a = Math.atan2(y2 - y1, x2 - x1);
	const w = size * 0.55;
	const bx = x2 - size * Math.cos(a);
	const by = y2 - size * Math.sin(a);
	const px = -Math.sin(a) * w;
	const py = Math.cos(a) * w;
	return `M${x2},${y2}L${bx + px},${by + py}L${bx - px},${by - py}Z`;
}

/** Points for a 5-pointed star centered at (cx, cy). */
export function starPoints(cx, cy, r = 13) {
	const pts = [];
	for (let i = 0; i < 10; i++) {
		const rad = i % 2 ? r * 0.45 : r;
		const a = -Math.PI / 2 + (i * Math.PI) / 5;
		pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
	}
	return pts.join(" ");
}
