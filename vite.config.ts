import { sveltekit } from '@sveltejs/kit/vite'
import type { ProxyOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'
// import { join } from 'path'
// import { partytownVite } from '@builder.io/partytown/utils'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { BASE_PATH } from './svelte.config'
// import mkcert from 'vite-plugin-mkcert' // if https needed in dev without a reverse proxy

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	// const HTTP_ENDPOINT = env.PUBLIC_LITEKART_API_URL || 'https://api.litekart.in'
	const HTTP_ENDPOINT = env.PUBLIC_HTTP_ENDPOINT

	const proxyConfig: ProxyOptions = {
		target: HTTP_ENDPOINT,
		headers: { PXM_USER: env.PUBLIC_PRODEXA_API_USER },
		secure: false,
		changeOrigin: true,
		preserveHeaderKeyCase: true,
		cookiePathRewrite: '/pxc-remove',
		rewrite: (path) => `${path.replace(new RegExp(`^${BASE_PATH}/`), '/')}`,
		configure: (proxy, _options) => {
			proxy.on('proxyRes', (proxyRes, req, res) => {
				delete proxyRes.headers['set-cookie']
			})
			proxy.on('proxyReq', (
					proxyReq,
					req,
					res,
					options
				) => {
					[
						'x-forwarded-proto',
						'x-forwarded-port',
						'x-forwarded-for',
						'x-forwarded-host',
						'x-forwarded-server'
					].forEach(header => {
						proxyReq.removeHeader(header)
					})
				}
			)
		}
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
			// mkcert() // if https needed in dev without a reverse proxy
			// partytownVite({
			// 	dest: join(process.cwd(), 'static', '~partytown')
			// })
		],
		server: {
			host: true,
			port: 3000,
			proxy:
				HTTP_ENDPOINT === env.PUBLIC_PRODEXA_API_URL ? {
						[`${BASE_PATH}/api/`]: proxyConfig,
						[`${BASE_PATH}/prodexa-img/`]: {
							...proxyConfig,
							// replace `/prodexa-img/` with `/workarea/`
							rewrite: (path) =>
								`${path.replace(new RegExp(`^${BASE_PATH}/prodexa-img/`), '/workarea/')}`
						},
						[`${BASE_PATH}/workarea-cdn/`]: {
							...proxyConfig,
							// replace `/workarea-cdn/fit-in/${w}x${h}/prodexa-img/` with `/workarea/`
							rewrite: (path) =>
								`${path.replace(new RegExp(`^${BASE_PATH}/workarea-cdn/fit-in/(\\d*)x(\\d*)/prodexa-img/`), '/workarea/')}`
						}
					} :
					{
						[`${BASE_PATH}/api`]: {
							target: HTTP_ENDPOINT,
							rewrite: (path) => `${path.replace(new RegExp(`^${BASE_PATH}/`), '/')}`
						},
						[`${BASE_PATH}/sitemap`]: {
							target: 'https://s3.ap-south-1.amazonaws.com/litekart.in',
							rewrite: (path) => `${path.replace(new RegExp(`^${BASE_PATH}/`), '/')}`
						}
					}
		}
	}
})
