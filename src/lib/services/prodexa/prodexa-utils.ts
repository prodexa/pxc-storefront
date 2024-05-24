import type { AllOrders, AllProducts, Brand, Category, Facet, Order, Product } from '$lib/types'

export const mapProdexajsAllProducts = (p: any) => {
	if (p) {
		const products = p?.content?.map((p) => mapProdexajsProduct(p))
		const allProd: AllProducts = {
			count: p?.totalElements,
			currentPage: p?.number + 1,
			pageSize: p?.size,
			limit: p?.size,
			// TODO (gor) why both, the 'data' and 'products' are needed? they are the same!
			data: products, products,
			facets: p?.facets
		}
		return allProd
	} else {
		return {}
	}
}

export const mapProdexajsProduct = (p: any) => {
	if (p) {

		const documentViewTypes = [
			'preview',
			'product_image',
			'detail_view',
			// 'data_sheet', // exclude non images
			'others'
		]

		// TODO (gor) (doc.documentViewTypeId || doc.docAssociation_documentViewTypeId) AND (doc.path || doc.docAssociation_path)
		const images = p?.docAssociations
			?.filter((doc) => documentViewTypes.includes(doc.documentViewTypeId || doc.docAssociation_documentViewTypeId))
			?.map((doc) => '/prodexa-img/' + (doc.path || doc.docAssociation_path))
			?.filter((path, index, pathes) => pathes.indexOf(path) === index)
		let img = ''
		if (images) {
			img = images[0]
		}

		// TODO lang
		let name = undefined
		if (p.values?.ShortDescription !== undefined) {
			name = p.values?.ShortDescription['en-GB']
		}
		if (name === undefined) {
			if (p['attrValue_string_ShortDescription_en-GB'] !== undefined) {
				name = p['attrValue_string_ShortDescription_en-GB'][0]
			}
		}

		let description = undefined
		if (p.values?.LongDescription !== undefined) {
			description = p.values?.LongDescription['en-GB']
		}

		const price = p.prices?.[0]?.price

		const brand: Brand = {
			_id: p.manufacturerId,
			name: p.manufacturerId,
			slug: p.manufacturerId,
			active: false
		}

		const categoryPool = p.classificationGroupAssociations?.map((g) => g.classificationId)?.filter((id, index, ids) => ids.indexOf(id) === index)
			.map((uniqueId) => {
				return {
					id: uniqueId,
					name: uniqueId,
					slug: uniqueId
				}
			})

		const prod: Product = {
			_id: p.catalogId + '___' + p.productId,
			id: p.catalogId + '___' + p.productId,
			slug: p.catalogId + '___' + p.productId,
			categoryPool,
			img,
			images,
			status: p.statusId,
			name,
			description,
			price,
			brand,
			active: true,
			hasStock: true
		}
		return prod
	} else {
		return {}
	}
}

export const mapProdexajsCategoryClassification = (c: any) => {
	if (c) {
		const r: Category = {
			id: c.classificationId,
			name: c.fallbackDescription,
			slug: c.classificationId,
			link: c.classificationId,
			children: c.category_children
				? c.category_children.map((i: any) => {
					if (i) return mapProdexajsCategoryClassification(i)
				})
				: []
		}
		return r
	} else {
		return {}
	}
}


export const mapMedusajsAllOrders = (o: any) => {
	if (o) {
		const allOrd: AllOrders = {
			count: o?.count,
			pageSize: o?.limit,
			currentPage: o?.page || 1,
			data: o?.orders.map((oo) => mapMedusajsOrder(oo))
		}
		return allOrd
	} else {
		return {}
	}
}

export const mapMedusajsOrder = (o: any) => {
	if (o) {
		const ord: Order = {
			_id: o.id,
			status: o.status,
			paymentStatus: o.payment_status,
			cartId: o.cart_id,
			customer: o.customer,
			address: o.address,
			// cart: o.cart,
			// customer_id: o.customer_id,
			// user: o.customer,
			orderItems: o.items.map((i: any) => {
				if (i)
					return {
						_id: i.id,
						orderItemId: i.order_id,
						description: i.description,
						name: i.title,
						img: i.thumbnail,
						price: i.unit_price,
						total: i.total,
						subtotal: i.subtotal,
						tax: i.tax_total,
						qty: i.quantity
					}
			}),
			orderNo: o.id,
			createdAt: o.created_at,
			updatedAt: o.updated_at,
			user: o.user,
			userEmail: o.email,
			billingAddress: o.billing_address.map((a: any) => {
				if (a)
					return {
						address: a.address_1,
						city: a.city,
						country: a.country_code,
						firstName: a.first_name,
						lastName: a.last_name,
						phone: a.phone,
						state: a.province,
						zip: a.postal_code
					}
			}),
			paySuccess: o.paid_total,
			totalAmountRefunded: o.refunded_total,
			amount: {
				currency: o.currency_code,
				discount: 100 * ((o.total - o.discount_total) / o.total),
				qty: o.items.length,
				shipping: o.shipping_total,
				subtotal: o.subtotal,
				tax: o.tax_total,
				total: o.total
			},
			items: o.items.map((i: any) => {
				if (i)
					return {
						_id: i.id,
						orderItemId: i.order_id,
						description: i.description,
						name: i.title,
						img: i.thumbnail,
						price: i.unit_price,
						total: i.total,
						subtotal: i.subtotal,
						tax: i.tax_total,
						qty: i.quantity
					}
			})
		}
		return ord
	} else {
		return {}
	}
}


// Cart data
export const mapMedusajsCart = (c: any) => {
	if (c) {
		return {
			billingAddress: c.billing_address,
			cart_id: c.id,
			currencyCode: c.region.currency_code,
			currencyName: c.region.currency_code,
			currencySymbol: null,
			discount: {
				code: null,
				amount: c.discount_total,
				formattedAmount: {
					value: c.discount_total,
					currency: c.region.currency_code
				}
			},
			formattedAmount: {
				subtotal: {
					value: c.subtotal,
					currency: c.region.currency_code
				},
				discount: {
					value: c.discount_total,
					currency: c.region.currency_code
				},
				shipping: {
					value: c.shipping_total,
					currency: c.region.currency_code
				},
				tax: {
					value: c.tax_total,
					currency: c.region.currency_code
				},
				total: {
					value: c.total,
					currency: c.region.currency_code
				}
			},
			id: c.id,
			items: c.items?.map((item) => ({
				id: item.id,
				vid: item.variant_id,
				name: item.title,
				description: item.description,
				sku: item.sku,
				img: item.thumbnail,
				qty: item.quantity,
				price: item.unit_price,
				mrp: item.unit_price,
				discount: 0,
				formattedItemAmount: {
					price: c.region.currency_code.toUpperCase() + ' ' + item.unit_price
				}
			})),
			offer_total: null,
			qty: c.items.reduce((total, item) => total + item.quantity, 0),
			shipping: {
				price: c.shipping_total,
				tax: c.shipping_tax_total,
				formattedPrice: {
					value: c.shipping_total,
					currency: c.region.currency_code
				}
			},
			active: true,
			codAvailable: false,
			createdAt: c.created_at,
			needAddress: true,
			needPrescription: false,
			selfTakeout: false,
			shippingAddress: c.shipping_address,
			sid: c.id,
			slug: c.handle,
			store: null,
			storeCurrency: c.region.currency_code,
			subtotal: c.subtotal,
			tax: c.tax_total,
			total: c.total,
			uid: c.customer_id,
			// unavailableItems: [],
			updatedAt: c.updated_at
		}
	}
	return null
}

export const mapProdexajsFacets = (f: any) => {
	if (f) {
		const buckets = f.map((p) => mapProdexajsFacet(p))
		const allF = {
			doc_count: 1,
			all: {
				buckets
			}
		}
		// console.log('allProd', allProd)
		return allF
	} else {
		return {}
	}
}

export const mapProdexajsFacet = (f: any) => {
	if (f) {
		const facet: Facet = {
			key: f.val,
			doc_count: f.count
		}
		return facet
	} else {
		return {}
	}
}


export const mapProdexajsAttrFacets = (f: any) => {
	if (f) {
		const buckets = f.map((p) => mapProdexajsAttrFacet(p))
		const allF = {
			doc_count: 1,
			all: {
				key: {
					buckets
				}
			}
		}
		// console.log('allProd', allProd)
		return allF
	} else {
		return {}
	}
}

export const mapProdexajsAttrFacet = (f: any) => {
	if (f) {
		const buckets = []
		const facet: Facet = {
			//key: f.label ? f.label : f.val,
			key: f.val,
			doc_count: f.count,
			id: f.val,
			value: {
				buckets
			}
		}
		return facet
	} else {
		return {}
	}
}

export const mapProdexajsAutocomplete = (a: any) => {
	if (a) {
		return {
			'count': 1,
			'type': 'product',
			'slug': a.catalogId + '___' + a.productId,
			'key': a['attrValue_string_ShortDescription_en-GB']
		}
	} else {
		return {}
	}
}
