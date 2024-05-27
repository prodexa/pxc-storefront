import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import type { AllProducts, Product } from '$lib/types'
import {
	mapProdexaAllProducts,
	mapProdexaAttrFacets,
	mapProdexaFacet,
	mapProdexaFacets,
	mapProdexaProduct
} from './prodexa-utils'
import queryString from 'query-string'

const productsEndpoint = 'products/search/full-product'
const productsFacetsEndpoint = 'products/search/facets'

const enGB = 'en-GB'
const shortDescription = 'ShortDescription'
const parseQueryString = query => {
	const params = queryString.parse(query, { arrayFormat: 'comma' })
	// console.log('params=', params)
	// sort
	let sort = params.sort || ''
	let sortPxm = ''
	let dir = ''
	if (sort) {
		if (sort.startsWith('-')) {
			sort = sort.substring(1)
			dir = 'desc'
		} else {
			dir = 'asc'
		}
		switch (sort) {
			case 'name' : {
				sortPxm = `attrValue_string_${shortDescription}_${enGB}`
				break
			}
			case 'updatedAt' : {
				sortPxm = 'changedOn'
				break
			}
			default: {
				sortPxm = ''
			}
		}
		if (sortPxm) {
			sort = sortPxm + ',' + dir
		} else {
			sort = ''
		}
	}

	// pxmPage starts from 0, svelte page starts from 1
	let pxmPage = 0
	if (params.page) {
		pxmPage = params.page - 1
	}

	// q - query string from search field
	const q = params.q || ''

	const manufacturerId = params.brands || ''
	const supplierId = params.vendors || ''

	let attributeValuesQ = {}
	const fixedParamNames = ['sort', 'page', 'q', 'brands', 'vendors']
	const attrValues = Object.keys(params).filter((k) => fixedParamNames.indexOf(k) === -1)
		.map((k) => {
			attributeValuesQ[k] = params[k] instanceof Array ? params[k] : [params[k]]
		})

	return {
		sort, pxmPage, q, manufacturerId, supplierId, attributeValuesQ
	}
}

export const searchProducts = async ({ origin, query }) => {
	console.log('searchProducts', query)

	try {
		let category = ''
		let count = 0
		let err = ''
		let facets = ''
		let pageSize = 0
		let products = []
		let res = {}
		let style_tags = []

		const p = await post(
			`${productsEndpoint}?${query}`,
			{
				'searchParams': {},
				'facetParams': {
					'hierarchyPaths': ['/' + category],
					'labels': {
						['/' + category]: category
					}
				}
			},
			origin
		)

		res = {
			count: p?.totalElements,
			pageSize: p?.size,
			noOfPage: p?.number,
			maxPage: p?.totalPages,
			estimatedTotalHits: p?.totalElements,
			category: category
		}

		products = p?.content?.map(mapProdexaProduct)
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return { products, count, facets, pageSize, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products called from the search field
export const fetchProducts = async ({ query = '', origin }: any) => {
	console.log('fetchProducts', query)

	try {
		const parsedQuery = parseQueryString(query)
		// console.log(parsedQuery)
		const p = await post(
			`${productsEndpoint}?searchValue=${parsedQuery.q}&page=${parsedQuery.pxmPage}&sort=${parsedQuery.sort}`,
			{ 'searchParams': {} },
			origin
		)
		return mapProdexaAllProducts(p) || []

	} catch (e) {
		console.log(e)
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReels = async ({ origin, storeId, slug, id, sid = null }: any) => {
	console.log('fetchReels')

	try {
		let res: AllProducts | {} = {}

		// TODO ...

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product
export const fetchProduct = async ({ origin, slug }) => {
	console.log('fetchProduct', slug)

	try {
		let res: Product | object = {}
		const slug1 = slug.replace('___', '/')
		// console.log('slug', slug)
		const p = await getAPI(
			`product-editor/products/${slug1}`,
			origin
		)
		res = mapProdexaProduct(p)
		// console.log('fetchProduct res=', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// TODO ...
// Fetch products more requirements
// the same as fetchProduct
// used by routes/(product)/product/[slug]/+page.svelte
// while fetchProduct used by routes/(product)/product/[slug]/+page.ts
// this is weird and as a result we have 2 product api calls
// on the product details page
export const fetchProduct2 = async ({ origin, slug }) => {
	console.log('fetchProduct2', slug)
	return fetchProduct({ origin, slug })
}

// Fetch products based on category called when selecting category
export const fetchProductsOfCategory = async ({ categorySlug, origin, query }) => {
	console.log('fetchProductsOfCategory')

	try {
		let res = {}
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = {}
		let err = ''
		let currentPage = 0

		const parsedQueryString = parseQueryString(query)

		const p = await post(
			`${productsEndpoint}?searchValue=${parsedQueryString.q}&page=${parsedQueryString.pxmPage}&sort=${parsedQueryString.sort}`,
			{
				searchParams: {},
				facetParams: {
					hierarchyPaths: ['/' + categorySlug],
					labels: {
						['/' + categorySlug]: categorySlug
					},
					manufacturerId: parsedQueryString.manufacturerId,
					supplierId: parsedQueryString.supplierId,
					attributeValues: parsedQueryString.attributeValuesQ
				}
			},
			origin
		)
		products = p?.content?.map((p) => mapProdexaProduct(p))

		// facets
		const manufacturerFacetsPxm = await post(
			`${productsFacetsEndpoint}/fields/manufacturerId`,
			{
				'searchParams': {},
				'facetParams': {
					hierarchyPaths: ['/' + categorySlug]
				}
			},
			origin
		)
		const manufacturerFacets = mapProdexaFacets(manufacturerFacetsPxm)

		const supplierFacetsPxm = await post(
			`${productsFacetsEndpoint}/fields/supplierId`,
			{
				'searchParams': {},
				'facetParams': {
					hierarchyPaths: ['/' + categorySlug]
				}
			},
			origin
		)
		const supplierFacets = mapProdexaFacets(supplierFacetsPxm)

		// !!!!!!!
		// TODO need to have only one call that will fetch attr with values
		const attributesFacetsPxm = await post(
			`${productsFacetsEndpoint}/attributes`,
			{
				'searchParams': {},
				'facetParams': {
					hierarchyPaths: ['/' + categorySlug],
					attributeValues: parsedQueryString.attributeValuesQ
				}
			},
			origin
		)
		const attributesFacets = mapProdexaAttrFacets(attributesFacetsPxm)
		for (const bucket of attributesFacets?.all?.key.buckets) {
			try {
				const attributeValuesPxm = await post(
					`${productsFacetsEndpoint}/attribute-values/${bucket.id}`,
					{
						'searchParams': {},
						'facetParams': {
							hierarchyPaths: ['/' + categorySlug]
						}
					},
					origin
				)
				bucket.value.buckets = attributeValuesPxm.map((av) => mapProdexaFacet(av))
			} catch (e) {
				console.log('e=', e)
			}
		}

		const allFacets = {
			'all_aggs': {
				doc_count: 1,
				brands: manufacturerFacets,
				vendors: supplierFacets,
				attributes: attributesFacets
			}
		}

		res = {
			count: p?.totalElements,
			pageSize: p?.size,
			noOfPage: p?.number,
			maxPage: p?.totalPages,
			estimatedTotalHits: p?.totalElements,
			category: categorySlug,
			facets: allFacets
		}
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null
		currentPage = res?.noOfPage

		currentPage = currentPage + 1

		return {
			category,
			count,
			currentPage,
			err,
			facets,
			pageSize,
			products
		}
	} catch (e) {
		return {}
	}
}

// Fetch next product

export const fetchNextPageProducts = async ({ origin, categorySlug, nextPage }) => {
	console.log('fetchNextPageProducts')

	try {
		let nextPageData = []
		let res = {}

		const p = await post(
			`${productsEndpoint}?page=${nextPage}`,
			{
				'searchParams': {},
				'facetParams': {
					'hierarchyPaths': ['/' + categorySlug],
					'labels': {
						['/' + categorySlug]: categorySlug
					}
				}
			},
			origin
		)
		res = {
			category: categorySlug,
			count: p?.totalElements,
			// pageSize: p?.size,
			// noOfPage: p?.number,
			// maxPage: p?.totalPages,
			estimatedTotalHits: p?.totalElements
			//facets:
		}
		nextPageData = p?.content?.map((p) => mapProdexaProduct(p))

		// count = res?.count
		// facets = res?.facets
		// pageSize = res?.pageSize
		// category = res?.category
		// err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return {
			category: res.category,
			count: res.count,
			estimatedTotalHits: res.estimatedTotalHits,
			facets: res.facets,
			nextPageData: nextPageData || []
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch related products

export const fetchRelatedProducts = async ({ pid }) => {
	console.log('fetchRelatedProducts')

	try {
		let relatedProductsRes = {}

		// TODO ..

		const relatedProducts = relatedProductsRes?.data.filter((p) => {
			return p._id !== pid
		})

		return relatedProducts || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
