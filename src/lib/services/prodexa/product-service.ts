import {error} from '@sveltejs/kit'
import {getAPI, post} from '$lib/utils/api'
import {getBySid} from '$lib/utils/server'
import type {AllProducts, Product} from '$lib/types'
import {
  mapProdexajsAllProducts,
  mapProdexajsAttrFacets,
  mapProdexajsFacet,
  mapProdexajsFacets,
  mapProdexajsProduct,
} from "./prodexa-utils";
import queryString from 'query-string'

const isServer = import.meta.env.SSR

// Search product

export const searchProducts = async ({ origin, query, storeId, sid = null }) => {
  console.log('searchProducts')
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
      `products/search?${query}`,
      {
        "searchParams": {},
        "facetParams": {
          "hierarchyPaths": ["/" + category],
          "labels": {
            ["/" + category]: category
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
    products = p?.content?.map((p) => mapProdexajsProduct(p))

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

function parseQueryString(query) {
  const params =  queryString.parse(query, {arrayFormat: 'comma'})
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
        sortPxm = 'attrValue_string_ShortDescription_en-GB'
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
    pxmPage = params.page - 1;
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
    sort, pxmPage, q, manufacturerId, supplierId, attributeValuesQ,
  }
}

// Fetch all products called from the search field
export const fetchProducts = async ({
	id,
	query = '',
	origin,
	isCors = false,
	sid = null,
	slug,
	storeId
}: any) => {
  console.log('fetchProducts')
  try {
    const parsedQueryString = parseQueryString(query)
    // console.log(parsedQueryString)
    const p = await post(
      `products/search?searchValue=${parsedQueryString.q}&page=${parsedQueryString.pxmPage}&sort=${parsedQueryString.sort}`,
      {
        "searchParams": {},
      },
      origin
    )
    const result  = mapProdexajsAllProducts(p)
    // console.log('result', result)
    return result || []
	} catch (e) {
    console.log(e)
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReels = async ({ origin, storeId, slug, id, sid = null }: any) => {
  console.log('fetchReels')

  try {
		let res: AllProducts | {} = {}

		// TODO

		res.data = res.data.map((d) => {
			return { ...d, muted: false }
		})
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product
export const fetchProduct = async ({ origin, slug, id, storeId, isCors = false, sid }) => {
  console.log('fetchProduct')
  try {
		let res: Product | object = {}
    const slug1 = slug.replace('___', '/')
    // console.log('slug', slug)
    const p = await getAPI(
        `product-editor/products/${slug1}`,
         origin
    )
    res = mapProdexajsProduct(p)
    // console.log('fetchProduct res=', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products more requirements
// the same as fetchProduct
// used by routes/(product)/product/[slug]/+page.svelte
// while fetchProduct used by routes/(product)/product/[slug]/+page.ts
// this is weird and as a result we have 2 product api calls
// on the product details page
export const fetchProduct2 = async ({ origin, slug, storeId, id, sid = null }) => {
  console.log('fetchProduct2')
  try {
		let res: Product | object = {}
    const slug1 = slug.replace('___', '/')
    const p = await getAPI(
      `product-editor/products/${slug1}`,
      origin
    )
    res = mapProdexajsProduct(p)
    return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products based on category called when selecting category
export const fetchProductsOfCategory = async ({
	categorySlug,
	origin,
	query,
	sid = null,
	storeId,
	zip = null
}) => {
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
      `products/search?searchValue=${parsedQueryString.q}&page=${parsedQueryString.pxmPage}&sort=${parsedQueryString.sort}`,
      {
        searchParams: {
        },
        facetParams: {
          hierarchyPaths: ["/" + categorySlug],
          labels: {
            ["/" + categorySlug]: categorySlug
          },
          manufacturerId: parsedQueryString.manufacturerId,
          supplierId: parsedQueryString.supplierId,
          attributeValues: parsedQueryString.attributeValuesQ,
        }
      },
      origin
    )
    products = p?.content?.map((p) => mapProdexajsProduct(p))

    // facets
    const manufacturerFacetsPxm = await post(
      `products/search/facets/fields/manufacturerId`,
      {
        "searchParams": {},
        "facetParams": {
          hierarchyPaths: ["/" + categorySlug],
        }
      },
      origin
    )
    const manufacturerFacets = mapProdexajsFacets(manufacturerFacetsPxm)

    const supplierFacetsPxm = await post(
      `products/search/facets/fields/supplierId`,
      {
        "searchParams": {},
        "facetParams": {
          hierarchyPaths: ["/" + categorySlug],
        }
      },
      origin
    )
    const supplierFacets = mapProdexajsFacets(supplierFacetsPxm)

    // !!!!!!!
    // TODO need to have only one call that will fetch attr with values
    const attributesFacetsPxm = await post(
      `products/search/facets/attributes`,
      {
        "searchParams": {},
        "facetParams": {
          hierarchyPaths: ["/" + categorySlug],
          attributeValues: parsedQueryString.attributeValuesQ,
        }
      },
      origin
    )
    const attributesFacets = mapProdexajsAttrFacets(attributesFacetsPxm)
    for (const bucket of  attributesFacets?.all?.key.buckets) {
      try {
        const attributeValuesPxm = await post(
          `products/search/facets/attribute-values/${bucket.id}`,
          {
            "searchParams": {},
            "facetParams": {
              hierarchyPaths: ["/" + categorySlug],
            }
          },
          origin
        )
        const values = attributeValuesPxm.map((av) => mapProdexajsFacet(av))
        bucket.value.buckets = values
      }catch (e){
        console.log('e=', e)
      }
    }

    const allFacets = {
      "all_aggs": {
        doc_count: 1,
        brands: manufacturerFacets,
        vendors: supplierFacets,
        attributes: attributesFacets,
      }
    }
    // console.log('allFacets=', allFacets)
    // --- facets

    res = {
      count: p?.totalElements,
      pageSize: p?.size,
      noOfPage: p?.number,
      maxPage: p?.totalPages,
      estimatedTotalHits: p?.totalElements,
      category: categorySlug,
      facets: allFacets,
    }
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null
    currentPage = res?.noOfPage

    currentPage = currentPage + 1
    //console.log('currentPage=', currentPage)

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

export const fetchNextPageProducts = async ({
	isCors = false,
	origin,
	storeId,
	categorySlug,
	nextPage,
	searchParams = {},
	sid = null
}) => {
  console.log('fetchNextPageProducts')

	try {
		let nextPageData = []
		let res = {}

		// if (isServer || isCors) {
		// 	res = await getBySid(
		// 		`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
		// 		sid
		// 	)
		// } else {
		// 	res = await getAPI(
		// 		`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
		// 		origin
		// 	)
		// }

    const p = await post(
      `products/search?page=${nextPage}`,
      {
        "searchParams": {},
        "facetParams": {
          "hierarchyPaths": ["/" + categorySlug],
          "labels": {
            ["/" + categorySlug]: categorySlug
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
      estimatedTotalHits: p?.totalElements,
      //facets:
    }
    nextPageData = p?.content?.map((p) => mapProdexajsProduct(p))

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

export const fetchRelatedProducts = async ({
	isCors = false,
	origin,
	storeId,
	categorySlug,
	pid,
	sid = null
}) => {
  console.log('fetchRelatedProducts')

	try {
		let relatedProductsRes = {}

		if (isServer || isCors) {
			relatedProductsRes = await getBySid(
				`es/products?categories=${categorySlug}&store=${storeId}`,
				sid
			)
		} else {
			relatedProductsRes = await getAPI(
				`es/products?categories=${categorySlug}&store=${storeId}`,
				origin
			)
		}

		const relatedProducts = relatedProductsRes?.data.filter((p) => {
			return p._id !== pid
		})

		return relatedProducts || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
