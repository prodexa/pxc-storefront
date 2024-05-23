import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
// import { join } from 'path'
// import { partytownVite } from '@builder.io/partytown/utils'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	// const HTTP_ENDPOINT = env.PUBLIC_LITEKART_API_URL || 'https://api.litekart.in'
	const HTTP_ENDPOINT = env.PUBLIC_PRODEXA_API_URL || 'http://localhost:8080/pxm'
	const PXM_USER = env.PUBLIC_PRODEXA_API_USER || 'admin'

	const proxyCongfig = {
		target: HTTP_ENDPOINT,
		headers: {
			PXM_USER
		},
		secure: false,
		changeOrigin: true,
		cookiePathRewrite: ''
	}

	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{ico,png,svg,webp}']
				},
				srcDir: './src',
				// mode: 'development',
				scope: '/',
				base: '/',
				devOptions: {
					// enabled: true,
					type: 'module',
					navigateFallback: '/'
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {}
			})
			// partytownVite({
			// 	dest: join(process.cwd(), 'static', '~partytown')
			// })
		],
		server: {
			host: true,
			port: 3000,
			proxy: {
				'/api/': proxyCongfig,
				'/prodexa-img/': {
					...proxyCongfig,
					// replace `/prodexa-img/` with `/workarea/`
					rewrite: (path) =>
						`${path.replace(/^\/prodexa-img\//, '/workarea/')}`
				},
				'/workarea-cdn/': {
					...proxyCongfig,
					// replace `/workarea-cdn/fit-in/${w}x${h}/prodexa-img/` with `/workarea/`
					rewrite: (path) =>
						`${path.replace(/^\/workarea-cdn\/fit-in\/(\d*)x(\d*)\/prodexa-img\//, '/workarea/')}`
				}
				// '/sitemap': 'https://s3.ap-south-1.amazonaws.com/litekart.in',
			}
		}
	}
})
