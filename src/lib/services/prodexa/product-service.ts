import {error} from '@sveltejs/kit'
import {getAPI, post} from '$lib/utils/api'
import {getBySid} from '$lib/utils/server'
import type {AllProducts, Product} from '$lib/types'
import {
  mapProdexajsAllProducts,
  mapProdexajsManufactureFacets,
  mapProdexajsProduct,
}
  from "./prodexa-utils";

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
    let count = 0
    let facets = ''
    let pageSize = 0
    let category = {}
    let err = ''
    let currentPage = 0

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
        `/product-editor/products/${slug1}`,
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
export const fetchProduct2 = async ({ origin, slug, storeId, id, sid = null }) => {
  console.log('fetchProduct2')
  try {
		let res: Product | object = {}
    const slug1 = slug.replace('___', '/')
    const p = await getAPI(
      `/product-editor/products/${slug1}`,
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

    console.log('query', query)

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

    // pxm api search only one manufacturerId facet, more is not allowed
    // manufacturerId
    // brands=samsung%2CSpax
    const matchBrands = query.match('(brands)=([^&=]+)');
    let matchBrandsQ = ''
    if(matchBrands){
      matchBrandsQ = matchBrands[2];
    }
    // console.log('matchBrandsQ=', matchBrandsQ)


    const p = await post(
      `/products/search?searchValue=${q}&page=${pxmPageNumber}`,
      {
        searchParams: {
        },
        facetParams: {
          hierarchyPaths: ["/" + categorySlug],
          labels: {
            ["/" + categorySlug]: categorySlug
          },
          manufacturerId: matchBrandsQ,
        }
      },
      origin
    )
    products = p?.content?.map((p) => mapProdexajsProduct(p))
    // console.log('products=', products)
    // console.log('p=', p)

    // facets
    const manufacturerFacetsPxm = await post(
      `/products/search/facets/fields/manufacturerId`,
      {
        "searchParams": {},
        "facetParams": {
        }
      },
      origin
    )
    // console.log('manufacturerFacetsPxm=', manufacturerFacetsPxm)
    const manufacturerFacets = mapProdexajsManufactureFacets(manufacturerFacetsPxm)
    // console.log('manufacturerFacets=', manufacturerFacets)

    const allFacets = {
      "all_aggs": {
        doc_count: 1,
        brands: manufacturerFacets,
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
