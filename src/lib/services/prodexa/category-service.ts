import {error} from '@sveltejs/kit'
import {getAPI} from '$lib/utils/api'
import {getBySid} from '$lib/utils/server'
import { mapProdexajsCategoryClassification } from './prodexa-utils'
import type { Category} from '$lib/types'

const isServer = import.meta.env.SSR

export const fetchFooterCategories = async ({
	isCors = false,
	origin,
	megamenu = false,
	sid = null,
	storeId
}) => {
  console.log('fetchFooterCategories')
	try {
		let data: []

    // TODO

		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({
	children = false,
	id,
	isCors = false,
	origin,
	sid = null,
	storeId
}) => {
  // console.log('fetchCategory')
	try {
		let res = {}
    if (isServer || isCors) {
      res = await getBySid(
        `/classifications/${id}`,
        sid
      )
    } else {
      res = await getAPI(
        `/classifications/${id}`,
        origin
      )
    }
    const r = mapProdexajsCategoryClassification(res)
		return r || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// fill 'POPULAR SEARCHES' section with categories limit = 1000
export const fetchAllCategories = async ({
	featured = false,
	isCors = false,
	limit = null,
	origin,
	sid = null,
	storeId
}) => {
  // console.log('fetchAllCategories limit=', limit)
	try {
		let res = {}
    if (isServer || isCors) {
      res = await getBySid(
        `/classifications/search/findAllByParams?page=0&size=${limit || '1000'}`,
        sid
      )
    } else {
      res = await getAPI(
        `/classifications/search/findAllByParams?page=0&size=${limit || '1000'}`,
        origin
      )
    }

    const data = res.content.map((category: any) => {
      return mapProdexajsCategoryClassification(category)
    })

		const currentPage = res.number
		const pageSize = res.size
    // console.log(res)

		return { data, pageSize, currentPage }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({
	featured = false,
	isCors = false,
	origin,
	sid = null,
	storeId
}) => {
  // console.log('fetchAllProductsOfCategories')
	try {
		let res = {}
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (isServer || isCors) {
			res = await getBySid(catQ, sid)
		} else {
			res = await getAPI(catQ, origin)
		}
		// must return link:string, slug:string(optional) name:string, new:boolean
		currentPage = res?.page
		err = !products ? 'No result Not Found' : null
		facets = res?.facets?.all_aggs
		products = res?.data || []
		productsCount = res?.count

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({
	isCors = false,
	megamenu = false,
	origin,
	sid = null,
	storeId
}) => {
  // console.log('fetchMegamenuData')
	try {
    let data: []
    if (isServer || isCors) {
      data = await getBySid(
        `/classifications/search/findAllByParams?sort=orderNo,asc&page=0&size=1000`,
        sid
      )
    } else {
      data = await getAPI(
        `/classifications/search/findAllByParams?sort=orderNo,asc&page=0&size=1000`,
        origin
      )
    }
    const allCategories = data.content.map((category: any) => {
      return mapProdexajsCategoryClassification(category)
    })

    // to navigate any megamenu item to the categories page
    // it has to have the slug: 'categories'

    let menuItems = []

    for (let i = 0; i < 2; i++) {
      if(allCategories.length > i){
        const c: Category = {
          id: allCategories[i].id,
          name: allCategories[i].name,
          slug: allCategories[i].slug,
          children: allCategories[i]
        }
        menuItems.push(c)
      }
    }

    if(allCategories.length > 2){
      const c: Category = {
          id: 'otherCategories',
          name: 'Other categories',
          slug: 'categories',
          children: allCategories.slice(2, allCategories.length)
      }
      menuItems.push(c)
    }

    return menuItems || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}




