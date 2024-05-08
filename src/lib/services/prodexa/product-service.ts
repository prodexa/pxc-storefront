import {error} from '@sveltejs/kit'
import {getAPI, post} from '$lib/utils/api'
import {getBySid} from '$lib/utils/server'
import type {AllProducts, Product} from '$lib/types'
import {
  mapProdexajsProduct,
  mapProdexajsAllProducts
} from "./prodexa-utils";

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

		// if (isServer) {
		// 	res = await getBySid(`es/products?${query}&store=${storeId}`, sid)
		// } else {
		// 	res = await getAPI(`es/products?${query}&store=${storeId}`, origin)
		// }
		// res = res || {}
		// products = res?.data?.map((p) => {
		// 	if (p._source) {
		// 		const p1 = { ...p._source }
		// 		p1.id = p._id
		// 		return p1
		// 	} else {
		// 		return p
		// 	}
		// })
		// count = res?.count
		// facets = res?.facets
		// pageSize = res?.pageSize
		// err = !res?.estimatedTotalHits ? 'No result Not Found' : null

    const p = await post(
      `/products/search?${query}`,
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

// Fetch all products
// called from search field
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
    let count = 0
    let facets = ''
    let pageSize = 0
    let category = {}
    let err = ''
    let currentPage = 0

    //let res: AllProducts | {} = {}

		// if (isServer || isCors) {
		// 	res = await getBySid(`es/products?store=${storeId}&${query}`, sid)
		// } else {
		// 	res = await getAPI(`es/products?store=${storeId}&${query}`, origin)
		// }

    // console.log('q=', query)
    // pxmPageNumber starts from 0
    const matchPage = query.match('(page=(\\d*))');
    let pxmPageNumber = 0
    if(matchPage){
      pxmPageNumber = Number(matchPage[2]) - 1;
    }
    // console.log('pxmPageNumber=', pxmPageNumber)
    const matchQ = query.match('(q)=([^&=]+)');
    let q = ''
    if(matchQ){
      q = matchQ[2];
    }
    // console.log('q=', q)
    const p = await post(
      `/products/search?searchValue=${q}&page=${pxmPageNumber}`,
      {
        "searchParams": {},
      },
      origin
    )

    // const products = p?.content?.map((p) => mapProdexajsProduct(p))
    // console.log('products=', products)
    const result  = mapProdexajsAllProducts(p)
    // console.log('result=', result)
    return result || []

	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReels = async ({ origin, storeId, slug, id, sid = null }: any) => {
  console.log('fetchReels')

  try {
		let res: AllProducts | {} = {}

		if (isServer) {
			res = await getBySid(`reels?store=${storeId}`, sid)
		} else {
			res = await getAPI(`reels?store=${storeId}`, origin)
		}
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
		// if (isServer || isCors) {
		// 	res = await getBySid(`es/products/${slug || id}?store=${storeId}`, sid)
		// } else {
		// 	res = await getAPI(`es/products/${slug || id}?store=${storeId}`, origin)
		// }
    const slug1 = slug.replace('___', '/')
    console.log('slug', slug)
    const p = await getAPI(
        `/product-editor/products/${slug1}`,
         origin
    )
    res = mapProdexajsProduct(p)
    console.log('fetchProduct res=', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products more requirements

export const fetchProduct2 = async ({ origin, slug, storeId, id, sid = null }) => {
  console.log('fetchProduct2')

  try {
		let res: Product | object = {}
		// if (isServer) {
		// 	res = await getBySid(`es/products2/${slug || id}?store=${storeId}`, sid)
		// } else {
		// 	res = await getAPI(`es/products2/${slug || id}?store=${storeId}`, origin)
		// }

    const slug1 = slug.replace('___', '/')
    // console.log('slug1', slug1)
    const p = await getAPI(
      `/product-editor/products/${slug1}`,
      origin
    )
    // console.log(p)
    // console.log(slug, id)
    res = mapProdexajsProduct(p)
    console.log('fetchProduct2 res=', res)

    return res || {}

	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products based on category
// called when selecting group
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

		// if (isServer) {
		// 	res = await getBySid(
		// 		`es/products?categories=${categorySlug}&zip=${zip || ''}&store=${storeId}&${query}`,
		// 		sid
		// 	)
		// } else {
		// 	res = await getAPI(
		// 		`es/products?categories=${categorySlug}&zip=${zip || ''}&store=${storeId}&${query}`,
		// 		origin
		// 	)
		// }

    // console.log('q=', query)
    // pxmPageNumber starts from 0
    const matchPage = query.match('(page=(\\d*))');
    let pxmPageNumber = 0
    if(matchPage){
      pxmPageNumber = Number(matchPage[2]) - 1;
    }
    // console.log('pxmPageNumber=', pxmPageNumber)
    const matchQ = query.match('(q)=([^&=]+)');
    let q = ''
    if(matchQ){
      q = matchQ[2];
    }
    // console.log('q=', q)
    const p = await post(
      `/products/search?searchValue=${q}&page=${pxmPageNumber}`,
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
    products = p?.content?.map((p) => mapProdexajsProduct(p))
    // console.log('products=', products)

    res = {
      count: p?.totalElements,
      pageSize: p?.size,
      noOfPage: p?.number,
      maxPage: p?.totalPages,
      estimatedTotalHits: p?.totalElements,
      category: categorySlug
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
      `/products/search?page=${nextPage}`,
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