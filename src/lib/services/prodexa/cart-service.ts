import { error } from '@sveltejs/kit'
import { currency, getAPI, post, put } from '$lib/utils'
import { currencySymbol } from '$lib/config'
import { SLUG_SEPARATOR } from './prodexa-utils'

const CART_ENDPOINT = 'carts'

const mapCartItem = (item) => {
	const _id = `${item.catalogId}${SLUG_SEPARATOR}${item.productId}`
	return {
		...item,
		_id, slug: _id, pid: _id,
		img: '/prodexa-img' + item.previewUrl,
		name: item.productDescShort,
		qty: item.quantity,
		formattedItemAmount: { price: currency(item.netPrice, currencySymbol) }
	}
}

const mapCart = (cart) => {
	const totalNetPrice = cart.totalNetPrice
	const fmtTotalNetPrice = currency(totalNetPrice, currencySymbol)
	return ({
		...cart,
		cart_id: cart.businessDocumentId,
		qty: cart.totalQuantity,
		total: totalNetPrice, subtotal: totalNetPrice,
		items: cart.items?.filter((item) => item.isStockedItem)?.map(mapCartItem),
		unavailableItems: cart.items?.filter((item) => !item.isStockedItem)?.map(mapCartItem),
		formattedAmount: {
			subtotal: fmtTotalNetPrice, total: fmtTotalNetPrice,
			shipping: { value: 0 } // free shipping
		}
	})
}

const loadCart = async ({ cartId = null, origin = null }) => {
	let cart
	try {
		cart = cartId ? await getAPI(`${CART_ENDPOINT}/${cartId}`, origin) : {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
	return cart ? mapCart(cart) : {}
}

export const fetchCartData = loadCart
export const fetchRefreshCart = loadCart
export const fetchMyCart = loadCart

export const addToCartService = async ({ cartId, pid, qty, origin = null }) => {
	try {
		let res: { cartId?: string, sid?: string }

		const catalogId___productsId = pid.split(SLUG_SEPARATOR)
		res = await post(
			cartId ? `${CART_ENDPOINT}/${cartId}/add` : CART_ENDPOINT,
			{
				catalogId: catalogId___productsId[0],
				productId: catalogId___productsId[1],
				quantity: qty,
				cartId: cartId
			},
			origin
		)

		return mapCart({ ...res, sid: res.cartId }) || {}
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
		await put(
			`${CART_ENDPOINT}/${cartId}`,
			{
				billing_address_id,
				billing_address: billingAddress,
				cartId: cartId,
				selfTakeout,
				shipping_address_id,
				shipping_address: shippingAddress,
				store: storeId
			},
			origin
		)
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
