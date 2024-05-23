import { error } from '@sveltejs/kit'
import { getAPI, post } from 'lib/utils'
import { HTTP_ENDPOINT, HTTP_HEADERS } from 'lib/config'

const isServer = import.meta.env.SSR

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		// res = await getAPI(
		// 	'/api/business-documents/cart',
		// 	origin
		// 	//			{ ...HTTP_HEADERS, Cookie: 'connect.sid=' + sid }
		// )

		return res || {}
	} catch (e) {
		error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({
																				 origin,
																				 storeId,
																				 cookies,
																				 cartId,
																				 server = false,
																				 sid = null
																			 }: any) => {

	console.log('isServer', isServer)

	try {
		let res: any = {}
		const cart_id = cartId
		if (!cart_id || cart_id == 'undefined') return []

		// if (isServer) {
		// 	res = await getAPI(
		// 		`${HTTP_ENDPOINT}/api/business-documents/cart`,
		// 		origin,
		// 		{ ...HTTP_HEADERS, Cookie: 'connect.sid=' + sid }
		// 	)
		// } else {
		// 	res = await getAPI(
		// 		'/api/business-documents/cart',
		// 		origin
		// 		//			{ ...HTTP_HEADERS, Cookie: 'connect.sid=' + sid }
		// 	)
		// }

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = {} // TODO ...

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const addToCartService = async ({
																				 cartId,
																				 customizedData = null,
																				 customizedImg = null,
																				 options = null,
																				 pid,
																				 qty,
																				 vid,
																				 origin = null,
																				 sid = null,
																				 storeId
																			 }) => {

	try {
		let res = {}

		if (isServer) {
			res = await post(
				`${HTTP_ENDPOINT}/api/business-documents/cart/add`,
				{
					pid,
					vid,
					qty,
					customizedImg,
					store: storeId,
					cart_id: cartId,
					customizedData,
					options
				},
				origin,
				{ ...HTTP_HEADERS, Cookie: 'connect.sid=' + sid }
			)
		} else {
			// TODO ...
		}


		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({
																					 code,
																					 origin,
																					 storeId,
																					 server = false,
																					 sid = null
																				 }: any) => {
	try {
		let res: any = {}

		res = {} // TODO

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const removeCouponService = async ({
																						code,
																						origin,
																						storeId,
																						server = false,
																						sid = null
																					}: any) => {
	try {
		let res: any = {}

		res = {} // TODOn ...

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const updateCart = async ({
																	 cartId,
																	 billingAddress,
																	 email,
																	 customer_id,
																	 shippingAddress,
																	 cookies,
																	 sid = null
																 }: any) => {
	try {
		const body = {
			billing_address: {
				address_1: billingAddress.address_1,
				address_2: billingAddress.address_2,
				city: billingAddress.city,
				// country_code: billingAddress.country_code,
				country_code: billingAddress.country || 'in',
				first_name: billingAddress.first_name,
				landmark: billingAddress.landmark,
				last_name: billingAddress.last_name,
				phone: billingAddress.phone,
				postal_code: billingAddress.postal_code,
				province: billingAddress.province
			},
			shipping_address: {
				address_1: shippingAddress.address_1,
				address_2: shippingAddress.address_2,
				city: shippingAddress.city,
				// country_code: shippingAddress.country_code,
				country_code: shippingAddress.country || 'in',
				first_name: shippingAddress.first_name,
				landmark: shippingAddress.landmark,
				last_name: shippingAddress.last_name,
				phone: shippingAddress.phone,
				postal_code: shippingAddress.postal_code,
				province: shippingAddress.province
			},
			email: billingAddress.email,
			customer_id
		}
		// console.log('body', body);
		// console.log('cartId', cartId);

		let res: any = {}

		if (cartId) {
			// const res_data = await postMedusajsApi(`carts/${cartId}`, body, sid)
			// res = mapMedusajsCart(res_data?.cart)
			res = {} // TODO ...

			return res || {}
		}
	} catch (e) {
		error(e.status, e.message)
	}
}
