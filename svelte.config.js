import path from 'path'
import adapter from '@sveltejs/adapter-netlify'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$components: path.resolve('./src/components'),
			$stores: path.resolve('./src/stores'),
			$shared: path.resolve('./src/shared')
		}
	}
}

export default config
