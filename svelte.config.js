// import adapter from '@sveltejs/adapter-vercel'
// npm i -D @sveltejs/adapter-static
// import adapter from '@sveltejs/adapter-static'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

export const BASE_PATH = '/pxc'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
			preserve: ['ld+json']
		})
	],
	kit: {
		alias: {
			'lib/*': 'src/lib/*'
		},
		// adapter: adapter({
		// 	fallback: 'index.html'
		// }),
		adapter: adapter(),
		paths: {
			base: BASE_PATH
		},
		csrf: {
			checkOrigin: false
		}
	}
	// vitePlugin: {
	// 	experimental: {
	// 		inspector: true
	// 	}
	// }
}

export default config
