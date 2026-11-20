/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		fontFamily: {
			sans: ["Chivo Variable", "sans-serif"]
		},
		extend: {}
	},
	plugins: [require("@tailwindcss/typography")]
};
