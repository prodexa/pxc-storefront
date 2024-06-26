import { error, redirect } from '@sveltejs/kit'
import { WishlistService } from '$lib/services'
import { base } from '$app/paths'

export async function load({ cookies, locals, url }) {
	try {
		const { me, origin, sid, store, storeId } = locals

		if (!me || !sid) {
			redirect(307, `${base}/auth/login?ref=${url.pathname}${url.search}`)
		}

		const wishlistedProducts = await WishlistService.fetchWishlist({
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		if (wishlistedProducts) {
			return wishlistedProducts
		}
	} catch (e) {
		if (e.status === 401 || e.status === 403) {
			redirect(307, `${base}/auth/login`)
		}

		error(e.status, e.message)
	} finally {
	}
}

const toggleWishlist = async ({ request, cookies, locals }) => {
	const data = await request.formData()

	const pid = data.get('pid')
	const vid = data.get('vid')

	const { me, origin, sid, storeId } = locals

	if (!me || !sid) {
		redirect(307, `${base}/auth/login?ref=/my/wishlist/add/${pid}`)
	}
	try {
		const res = await WishlistService.toggleWishlistService({
			pid: pid,
			vid: vid,
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		return res
	} catch (e) {
		if (e.status === 401 || e.status === 403) {
			redirect(307, `${base}/auth/login`)
		}

		error(e.status, e.message)
	}
}

export const actions = { toggleWishlist }
