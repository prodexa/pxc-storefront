import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import type { AllProducts, Product } from '$lib/types'
const isServer = import.meta.env.SSR

// Search product

export const searchProducts = async ({ origin, query, storeId, sid = null }) => {
	try {
		let category = ''
		let count = 0
		let err = ''
		let facets = ''
		let pageSize = 0
		let products = []
		let res = {}
		let style_tags = []

		if (isServer) {
			res = await getBySid(`es/products?${query}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?${query}&store=${storeId}`, origin)
		}
		res = res || {}
		products = res?.data?.map((p) => {
			if (p._source) {
				const p1 = { ...p._source }
				p1.id = p._id
				return p1
			} else {
				return p
			}
		})
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return { products, count, facets, pageSize, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({
	id,
	query = '',
	origin,
	isCors = false,
	sid = null,
	slug,
	storeId
}: any) => {
	try {
		let res: AllProducts | {} = {}

		// if (isServer || isCors) {
		// 	res = await getBySid(`es/products?store=${storeId}&${query}`, sid)
		// } else {
		// 	res = await getAPI(`es/products?store=${storeId}&${query}`, origin)
		// }

		return res?.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReels = async ({ origin, storeId, slug, id, sid = null }: any) => {
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
	try {
		let res: Product | object = {}

		if (isServer || isCors) {
			res = await getBySid(`es/products/${slug || id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products/${slug || id}?store=${storeId}`, origin)
		}
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products more requirements

export const fetchProduct2 = async ({ origin, slug, storeId, id, sid = null }) => {
	try {
		let res: Product | object = {}
		if (isServer) {
			res = await getBySid(`es/products2/${slug || id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products2/${slug || id}?store=${storeId}`, origin)
		}
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch products based on category

export const fetchProductsOfCategory = async ({
	categorySlug,
	origin,
	query,
	sid = null,
	storeId,
	zip = null
}) => {
	try {
		let res = {}
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = {}
		let err = ''

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
    res =
      {
        "took": 14,
        "pageSize": 40,
        "noOfPage": 1,
        "maxPage": 50,
        "count": 1,
        "page": 1,
        "data": [
          {
            "_id": "64ad6e94630d27555597318a",
            "category": {
              "_id": "63b8f1fee497e2c0976880f5",
              "img": null,
              "link": "/books-en-en",
              "name": "Books",
              "namePath": null,
              "namePathA": [],
              "slug": "books-en-en"
            },
            "hasStock": true,
            "images": [
              "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/eb084f3c3f5f26e874333055ba570a99-28124561640.JPEG",
              "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/d0feacc52e9be7ed092dc2b0914a203b-73004598826.JPEG",
              "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/631fb57e2fc35ddbaca70e95e3acab82-895798442815.JPEG",
              "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/7317aa55aa28e0b41f9210f02cd74661-1061559341481.JPEG",
              "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/c4501430473f809b1e4c0d853349ca40-41293668895.JPEG"
            ],
            "img": "https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/eb084f3c3f5f26e874333055ba570a99-28124561640.JPEG",
            "isCustomized": false,
            "mrp": 5317,
            "name": "Black Women V-Neck Strappy Cut Out Long Sleeve Solid Casual T-Shirt Top",
            "price": 2903,
            "sku": "BlackWomenV-NeckStrappyCutOutLongSleeveSolidCasualT-ShirtTop-undefined",
            "slug": "black-women-v-neck-strappy-cut-out-long-sleeve-solid-casual-t-shirt-top-en",
            "tags": [],
            "vendor": {
              "_id": "642d353923905bbb8f087dbc",
              "businessName": "Litekart",
              "email": "admin@litekart.in",
              "name": "Swadesh Behera",
              "phone": "4545454545",
              "slug": "a1"
            }
          }
        ],
        "facets": {
          "style_count": {
            "value": 1
          },
          "all_aggs": {
            "doc_count": 874,
            "discount": {
              "doc_count": 1,
              "all": {
                "buckets": [
                  {
                    "key": "Any",
                    "from": 0,
                    "to": 100,
                    "doc_count": 1
                  },
                  {
                    "key": "10% and above",
                    "from": 10,
                    "to": 100,
                    "doc_count": 1
                  },
                  {
                    "key": "20% and above",
                    "from": 20,
                    "to": 100,
                    "doc_count": 1
                  },
                  {
                    "key": "30% and above",
                    "from": 30,
                    "to": 100,
                    "doc_count": 1
                  },
                  {
                    "key": "40% and above",
                    "from": 40,
                    "to": 100,
                    "doc_count": 1
                  },
                  {
                    "key": "50% and above",
                    "from": 50,
                    "to": 100,
                    "doc_count": 0
                  },
                  {
                    "key": "60% and above",
                    "from": 60,
                    "to": 100,
                    "doc_count": 0
                  }
                ]
              }
            },
            "vendor_name": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "active": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": 1,
                    "key_as_string": "true",
                    "doc_count": 1
                  }
                ]
              }
            },
            "genders": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "core_values": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "colors": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": "#000000",
                    "doc_count": 1
                  }
                ]
              }
            },
            "tags": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "vendor_country": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "materials": {
              "doc_count": 1,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
              }
            },
            "price": {
              "doc_count": 1,
              "all": {
                "buckets": [
                  {
                    "key": "Under $250",
                    "to": 250,
                    "doc_count": 0
                  },
                  {
                    "key": "₹250 - ₹500",
                    "from": 250,
                    "to": 500,
                    "doc_count": 0
                  },
                  {
                    "key": "₹500 - ₹1,000",
                    "from": 500,
                    "to": 1000,
                    "doc_count": 0
                  },
                  {
                    "key": "₹1,000 - ₹2,000",
                    "from": 1000,
                    "to": 2000,
                    "doc_count": 0
                  },
                  {
                    "key": "₹2,000 - ₹3,000",
                    "from": 2000,
                    "to": 3000,
                    "doc_count": 1
                  },
                  {
                    "key": "₹3,000 - ₹5,000",
                    "from": 3000,
                    "to": 5000,
                    "doc_count": 0
                  },
                  {
                    "key": "Over ₹5,000",
                    "from": 5000,
                    "doc_count": 0
                  }
                ]
              }
            },
            "lead_time": {
              "doc_count": 1,
              "all": {
                "buckets": [
                  {
                    "key": "3 days or less",
                    "from": 0,
                    "to": 4,
                    "doc_count": 0
                  },
                  {
                    "key": "6 days or less",
                    "from": 0,
                    "to": 7,
                    "doc_count": 0
                  },
                  {
                    "key": "9 days or less",
                    "from": 0,
                    "to": 10,
                    "doc_count": 0
                  },
                  {
                    "key": "14 days or less",
                    "from": 0,
                    "to": 15,
                    "doc_count": 0
                  }
                ]
              }
            },
            "attributes": {
              "doc_count": 1,
              "all": {
                "doc_count": 0,
                "key": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": []
                }
              }
            },
            "vendor_minimum": {
              "doc_count": 1,
              "all": {
                "buckets": [
                  {
                    "key": "No minimum",
                    "from": 0,
                    "to": 1,
                    "doc_count": 0
                  },
                  {
                    "key": "₹100 or less",
                    "from": 0,
                    "to": 100,
                    "doc_count": 0
                  },
                  {
                    "key": "₹200 or less",
                    "from": 0,
                    "to": 200,
                    "doc_count": 0
                  },
                  {
                    "key": "₹300 or less",
                    "from": 0,
                    "to": 300,
                    "doc_count": 0
                  }
                ]
              }
            },
            "categories": {
              "doc_count": 4,
              "all": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": "books-en-en",
                    "doc_count": 1
                  },
                  {
                    "key": "fashion-women",
                    "doc_count": 1
                  },
                  {
                    "key": "women-cosmetic",
                    "doc_count": 1
                  },
                  {
                    "key": "women-jewellery",
                    "doc_count": 1
                  }
                ]
              }
            }
          }
        },
        "category": {
          "_id": "63b8f1fee497e2c0976880f5",
          "children": [],
          "name": "Books",
          "slug": "books-en-en",
          "img": null,
          "keywords": "books",
          "metaDescription": "",
          "description": "<p>test description<br></p>",
          "topDescription": "<p>test top description<br></p>",
          "cache": "HIT"
        }
      }


		products = res?.data?.map((p) => {
			if (p._source) {
				const p1 = { ...p._source }
				p1.id = p._id
				return p1
			} else {
				return p
			}
		})
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return { products, count, facets, pageSize, category, err }
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
	try {
		let nextPageData = []
		let res = {}

		if (isServer || isCors) {
			res = await getBySid(
				`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
				sid
			)
		} else {
			res = await getAPI(
				`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
				origin
			)
		}

		nextPageData = res?.data?.map((p) => {
			if (p._source) {
				const p1 = { ...p._source }
				p1.id = p._id
				return p1
			} else {
				return p
			}
		})

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
