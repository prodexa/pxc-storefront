import {error} from '@sveltejs/kit'
import {getAPI} from '$lib/utils/api'
import {getBySid} from '$lib/utils/server'
import {mapMedusajsCategory} from "../medusa/medusa-utils";

const isServer = import.meta.env.SSR

export const fetchFooterCategories = async ({
	isCors = false,
	origin,
	megamenu = false,
	sid = null,
	storeId
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(
				`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`,
				sid
			)
		} else {
			data = await getAPI(
				`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`,
				origin
			)
		}

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
	try {
		let res = {}

		if (isServer || isCors) {
			res = await getBySid(`es/categories/${id}?store=${storeId}&children=${children}`, sid)
		} else {
			res = await getAPI(`es/categories/${id}?store=${storeId}&children=${children}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllCategories = async ({
	featured = false,
	isCors = false,
	limit = null,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		let catQ = `categories?store=${storeId}&page=0&limit=${limit || '1000'}`

		if (featured) {
			catQ += '&featured=true'
		}

		// if (isServer || isCors) {
		// 	res = await getBySid(catQ, sid)
		// } else {
		// 	res = await getAPI(catQ, origin)
		// }

    res = {
      "data": [
        {
          "_id": "5cbebc88d4d5ae5021a0b587",
          "name": "Bags",
          "children": [],
          "link": "bags",
          "slug": "bags"
        },
        {
          "_id": "63b8f1fee497e2c0976880f5",
          "children": [],
          "name": "Books",
          "link": "/books-en-en",
          "slug": "books-en-en",
          "img": null
        }
      ]
    }


		const currentPage = res.currentPage
		const data = res.data
		const pageSize = res.pageSize

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
	try {

    let groups_data: []

    let data: []
		// if (isServer || isCors) {
		// 	data = await getBySid(
		// 		`categories/megamenu?megamenu=${megamenu}&store=${storeId}&active=true`,
		// 		sid
		// 	)
		// } else {
		// 	data = await getAPI(
		// 		`categories/megamenu?megamenu=${megamenu}&store=${storeId}&active=true`,
		// 		origin
		// 	)
		// }

    if (isServer || isCors) {
      groups_data = await getBySid(
    		`/groups/search/findAllByParams`,
    		sid
    	)
    } else {
      groups_data = await getAPI(
    		`/groups/search/findAllByParams`,
    		origin
    	)
    }
    console.log(groups_data)

    const groups_mapped_data = groups_data.content.map((category: any) => {
      return mapProdexajsCategory(category)
    })
    console.log(groups_mapped_data)

    const r: Groups = [{
      id: 'Groups',
      name: 'Groups',
      slug: 'groups',
      children: groups_mapped_data
    }]

    console.log(r)

    // data = [
    //   {
    //     "_id": "6471f5fbf281dbfd0104c325",
    //     "new": false,
    //     "children":
    //       [
    //         {
    //           "_id": "6471f617f281dbfd0104c36e",
    //           "new": false,
    //           "children":
    //             [
    //               {
    //                 "_id": "6471f675f281dbfd0104c403",
    //                 "new": false,
    //                 "children":
    //                   [],
    //                 "name": "Fully Automatic Front Load",
    //                 "slug": "washing-machine-fully-automatic-front-load",
    //                 "link": "/fully-automatic-front-load",
    //                 "slugPath": null
    //               }
    //             ],
    //           "name": "Washing Machine",
    //           "slug": "tvs-appliances-washing-machine",
    //           "link": "/washing-machine",
    //           "slugPath": null
    //         }
    //       ],
    //     "name": "TVs & Appliances",
    //     "slug": "tvs-appliances-en",
    //     "link": "/tvs-appliances",
    //     "slugPath": null,
    //     "img": null
    //   }
    // ]
    //return data || []

    return r || []

	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}


export const mapProdexajsCategory = (c: any) => {
  if (c) {
    const r: Category = {
      id: c.classificationGroupId,
      name: c.classificationGroupId,
      slug: c.classificationGroupId,
      children: c.category_children
        ? c.category_children.map((i: any) => {
          if (i) return mapProdexajsCategory(i)
        })
        : []
    }
    return r
  } else {
    return {}
  }
}
