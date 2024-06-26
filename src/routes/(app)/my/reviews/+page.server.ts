import { error, redirect } from '@sveltejs/kit'
import { ReviewService } from '$lib/services'
import { base } from '$app/paths'

export async function load({ cookies, locals, url }) {
	const { store, storeId, origin, me, sid } = locals

	if (!me || !sid) {
		redirect(307, `${base}/auth/login?ref=${url.pathname}${url.search}`)
	}
	try {
		const res = await ReviewService.fetchReviews({
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		if (res) {
			return res
		}
		error(404, 'Reviews not found')
	} catch (e) {
		redirect(307, `${base}/auth/login`)
	}
}
