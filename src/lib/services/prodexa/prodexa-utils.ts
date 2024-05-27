import { currencyCode } from '$lib/config'
import type { AllProducts, Brand, Facet } from '$lib/types'

const languageTag = 'en-GB'
const slugSeparator = '___'

const documentViewTypes = [
	'preview',
	'product_image',
	'detail_view',
	// 'data_sheet', // exclude non images
	'others'
]

export const mapProdexaAllProducts = (p: any) => {
	if (p) {
		const products = p?.content?.map((p) => mapProdexaProduct(p))
		const allProd: AllProducts = {
			count: p?.totalElements,
			currentPage: p?.number + 1,
			pageSize: p?.size,
			limit: p?.size,
			// TODO (gor) why both, the 'data' and 'products' are needed? they are the same!
			products,
			data: products,
			facets: p?.facets
		}
		return allProd
	} else {
		return {}
	}
}

export const mapProdexaProduct = (product: any) => {
	if (!product) {
		return {}
	}

	const images = product?.docAssociations
		?.filter((doc) => documentViewTypes.includes(doc.documentViewTypeId))
		?.map((doc) => `/prodexa-img/${doc.path}`)
		?.filter((path, index, pathes) => pathes.indexOf(path) === index)
	const img = images?.[0]

	const name = product.values?.ShortDescription?.[languageTag]
	const description = product.values?.LongDescription?.[languageTag]

	// TODO ...
	// const price = product.prices?.[0]?.price
	const price = product.prices
		?.sort((a, b) => -a.changedOn.localeCompare(b.changedOn))
		?.filter((price: any) => price.currencyId === currencyCode)
		?.map((price: any) => price.price)
		?.[0]

	const brand: Brand = {
		_id: product.manufacturerId,
		name: product.manufacturerId,
		slug: product.manufacturerId,
		active: false
	}

	// TODO ... groups hierarchy ...
	const classificationId = product.classificationGroupAssociations?.[0]?.classificationId
	const categoryPool = [{
		id: classificationId,
		name: classificationId,
		slug: classificationId
	}]

	const slug = product.catalogId + slugSeparator + product.productId
	return {
		_id: slug,
		id: slug,
		slug,
		categoryPool,
		img,
		images,
		status: product.statusId,
		name,
		description,
		price,
		brand,
		active: true,
		hasStock: true
	}
}

export const mapProdexaCategoryClassification = (c: any) => {
	if (!c) {
		return {}
	}

	return {
		id: c.classificationId,
		name: c.fallbackDescription,
		slug: c.classificationId,
		link: c.classificationId,
		children: c.category_children
			? c.category_children.map((i: any) => {
				if (i) return mapProdexaCategoryClassification(i)
			})
			: []
	}
}

export const mapProdexaFacets = (f: any) => {
	if (!f) {
		return {}
	}

	const buckets = f.map((p) => mapProdexaFacet(p))
	return {
		doc_count: 1,
		all: {
			buckets
		}
	}
}

export const mapProdexaFacet = (f: any) => {
	if (!f) {
		return {}
	}

	const facet: Facet = {
		key: f.val,
		doc_count: f.count
	}
	return facet
}

export const mapProdexaAttrFacets = (f: any) => {
	if (!f) {
		return {}
	}

	const buckets = f.map((p) => mapProdexaAttrFacet(p))
	return {
		doc_count: 1,
		all: {
			key: {
				buckets
			}
		}
	}
}

export const mapProdexaAttrFacet = (f: any) => {
	if (!f) {
		return {}
	}

	const buckets = []
	const facet: Facet = {
		key: f.val,
		doc_count: f.count,
		id: f.val,
		value: {
			buckets
		}
	}
	return facet
}

export const mapProdexaAutocomplete = (a: any) => a
	? {
		'count': 1,
		'type': 'products',
		'slug': a.catalogId + slugSeparator + a.productId,
		'key': a.values?.ShortDescription?.[languageTag] || a.productId
	}
	: {}
