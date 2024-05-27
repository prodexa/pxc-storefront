import { error } from '@sveltejs/kit'
import { currency, getAPI, post, put } from '$lib/utils'
import { currencySymbol } from '$lib/config'

const CART_ENDPOINT = 'carts'

const mapCart = (cart) => {
	return {
		...cart,
		items: cart.items.map(it => ({
				...it,
				slug: it.pid, img: '/prodexa-img' + it.img,
				formattedItemAmount: { price: currency(it.price, currencySymbol) }
			}
		)),
		formattedAmount: {
			subtotal: currency(cart.subtotal, currencySymbol),
			total: currency(cart.total, currencySymbol),
			shipping: { value: 0 } // free
		}
	}
}

const loadCart = async ({ cartId = null, origin = null }) => {
	try {
		return mapCart(cartId ? await getAPI(`${CART_ENDPOINT}/${cartId}`, origin) : {})
	} catch (e) {
		error(e.status, e.data.message || e.message)
	}
}

export const fetchCartData = loadCart
export const fetchRefreshCart = loadCart
export const fetchMyCart = loadCart

export const addToCartService = async (
	{
		cartId,
		customizedData = null,
		customizedImg = null,
		options = null,
		pid,
		qty,
		vid,
		origin = null,
		storeId
	}
) => {
	try {
		let res = {}

		res = await post(
			cartId ? `${CART_ENDPOINT}/${cartId}/add` : CART_ENDPOINT,
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
			origin
		)

		res = { ...res, sid: res.cart_id }
		res = mapCart(res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const createBackOrder = async ({ pid, qty, origin = null, storeId }) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({ cartId, code, origin, storeId }) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const removeCouponService = async ({ cartId, code, origin, storeId }
) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart = async (
	{
		billing_address_id,
		billingAddress,
		cartId = '',
		selfTakeout,
		shipping_address_id,
		origin = null,
		shippingAddress,
		storeId
	}
) => {
	try {
		let res = {}
		res = await put(
			`${CART_ENDPOINT}/${cartId}`,
			{
				billing_address_id,
				billing_address: billingAddress,
				cart_id: cartId,
				selfTakeout,
				shipping_address_id,
				shipping_address: shippingAddress,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart2 = async (
	{
		cartId,
		selected_products_for_checkout,
		origin = null,
		storeId
	}
) => {
	try {
		let res = {}
		res = await put(
			`${CART_ENDPOINT}/${cartId}`,
			{
				cart_id: cartId,
				selected_products_for_checkout,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart3 = async (
	{
		shipping_address,
		billing_address,
		cartId,
		selfTakeout,
		origin = null,
		storeId
	}
) => {
	try {
		let res = {}
		res = await post(
			`${CART_ENDPOINT}/${cartId}`,
			{
				cart_id: cartId,
				selfTakeout,
				shipping_address,
				billing_address,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
