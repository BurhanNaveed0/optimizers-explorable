import { readFileSync } from "fs";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import dsv from "@rollup/plugin-dsv";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));

const config = {
	define: {
		__VERSION__: JSON.stringify(version),
		__TIMESTAMP__: JSON.stringify(new Date().toISOString())
	},
	plugins: [sveltekit(), dsv()],
	resolve: {
		alias: {
			$components: path.resolve("./src/components"),
			$data: path.resolve("./src/data"),
			$routes: path.resolve("./src/routes"),
			$stores: path.resolve("./src/stores"),
			$styles: path.resolve("./src/styles"),
			$utils: path.resolve("./src/utils")
		}
	}
};

export default config;
