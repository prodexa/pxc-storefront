import type { AllOrders, AllProducts, Category, Order, Product, Cart } from '$lib/types'

export const mapProdexajsAllProducts = (p: any) => {
  if (p) {
    const allProd: AllProducts = {
      count: p.count,
      // currentPage: p.currentPage,
      // pageSize: p.pageSize,
      limit: p.limit,
      products: p.products.forEach(mapProdexajsProduct),
      facets: p.facets
    }
    return allProd
  } else {
    return {}
  }
}

export const mapProdexajsProduct = (p: any) => {
  if (p) {
    const prod: Product = {
      _id: p.id,
      id: p.id,
      // createdAt: p.variants[0].created_at,
      // updatedAt: p.variants[0].updated_at,
      // deleted_at: p.variants[0].deleted_at,
      name: p.title,
      slug: p.handle,
      description: p.description,
      status: p.status,
      active: p.status === 'published' ? true : false,
      images: p.images?.map((i: any) => {
        if (i) return i.url
      }),
      img: p.thumbnail,
      // discountable: p.discountable,
      // external_id: p.external_id,
      variants: p.variants,
      sku: p.variants[0]?.sku,
      barcode: p.variants[0]?.barcode,
      ean: p.variants[0]?.ean,
      upc: p.variants[0]?.upc,
      hasStock: p.variants[0]?.inventory_quantity,
      // allow_backorder: p.variants[0]?.allow_backorder,
      // manage_inventory: p.variants[0]?.manage_inventory,
      hsn: p.variants[0]?.hs_code,
      countryOfOrigin: p.variants[0]?.origin_country,
      // mid_code: p.mid_code,
      // material: p.material,
      weight: p.variants[0]?.weight,
      height: p.variants[0]?.height,
      width: p.variants[0]?.width,
      length: p.variants[0]?.length,
      price:
        p.variants[0] &&
        p.variants[0]?.prices &&
        p.variants[0]?.prices[0] &&
        p.variants[0]?.prices[0]?.amount,
      mrp: p.variants[0] && p.variants[0]?.original_price_incl_tax,
      discount:
        100 *
        ((p.variants[0]?.original_price_incl_tax - p.variants[0]?.calculated_price_incl_tax) /
          p.variants[0]?.original_price_incl_tax),
      // options: p.variants[0].map((i: any) => {
      // 	if (i)
      // 		return {
      // 			name: i.value
      // 		}
      // }),
      // metaTitle: p.variants[0].metadata.title,
      // metaDescription: p.variants[0].metadata.description,
      // metaKeywords: p.variants[0].metadata.keywords,
      // price_without_tax: p.variants[0].original_price,
      // mrp_without_tax: p.variants[0].calculated_price,
      // original_tax: p.variants[0].prices[0].original_tax,
      // calculated_tax: p.variants[0].prices[0].calculated_tax,
      // tax_rates: p.variants[0].prices[0].tax_rates,
      // profile_id: p.profile_id,
      // profile: p.profile,
      // collection_id: p.collection_id,
      categoryPool: p.categories,
      // type_id: p.type_id,
      // type: p.type,
      tags: p.tags?.map((i: any) => {
        if (i)
          return {
            type: 'Ribbon',
            name: i.value
          }
      })
      // sales_channels: p.sales_channels,
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
