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
  const PXM_LOGIN = env.PXM_LOGIN || 'admin'
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
				'/api/': {
					target: HTTP_ENDPOINT,
					headers: {
						PXM_USER: PXM_LOGIN
					},
					secure: false,
					changeOrigin: true,
					cookiePathRewrite: ''
				},
				'/workarea-cdn/': {
					target: HTTP_ENDPOINT,
					headers: {
						PXM_USER: PXM_LOGIN
					},
					secure: false,
					changeOrigin: true,
					cookiePathRewrite: '',
					rewrite: (path) => {
						// remove `/workarea-cdn/fit-in/${w}x${h}/`
						const targetPath = path.split('/').slice(4).join('/')
						return `/workarea/${targetPath}`;
					},
				}
				// '/sitemap': 'https://s3.ap-south-1.amazonaws.com/litekart.in',
      }
		}
	}
})
