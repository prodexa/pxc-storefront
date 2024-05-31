// import adapter from '@sveltejs/adapter-vercel'
//import adapter from '@sveltejs/adapter-static'
//import adapter from '@sveltejs/adapter-node'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

export const BASE_PATH = '/pxc'
//export const BASE_PATH = ''

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
		adapter: adapter(),
		paths: {
			base: BASE_PATH,
			relative: false
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
