import { error, redirect } from '@sveltejs/kit'
import { ProductService } from '$lib/services'
import { base } from '$app/paths'

export const prerender = false

export async function load({ url, locals, cookies }) {
	const pid = url.searchParams.get('pid')
	const ref = url.searchParams.get('ref')

	let product

	try {
		product = await ProductService.fetchProduct({
			id: pid,
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		if (!product) error(404, 'Product not found')

		return { ref, product }
	} catch (e) {
		if (e.status === 401 || e.status === 403) {
			redirect(307, `${base}/auth/login`)
		}

		error(e.status, e.message)
	}
}
