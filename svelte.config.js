import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapterStatic()
	}
};

export default config;
