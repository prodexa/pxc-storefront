import {error} from '@sveltejs/kit'
import {post} from '$lib/utils/api'
import {mapProdexaAutocomplete, mapProdexaAutocompleteNonProduct, LANGUAGE_TAG} from './prodexa-utils'

export const fetchAutocompleteData = async ({origin, q}: any) => {
  if (q?.length < 3) {
    return []
  }
  let dataProd = []
  let dataNonProd = []

  try {
    // search by product
    const resProd = await post(
      `products/search/short-product?searchValue=${q}&page=0&size=10`,
      {},
      origin
    )
    dataProd = resProd?.content?.map(mapProdexaAutocomplete) || []
  } catch (e) {
    console.log(e)
  }

  try {
    // search by facets
    const resNonProd = await post(
      `products/search/autocomplete?searchValue=${q}&limit=5&anguage=${LANGUAGE_TAG}`,
      {},
      origin
    )
    dataNonProd = resNonProd?.map(mapProdexaAutocompleteNonProduct) || []
  } catch (e) {
    console.log(e)
  }

  const search = {
    count: 1,
    type: 'search',
    key: q
  }

  if (dataNonProd.length == 0) {
    dataNonProd.push(search)
  }

  return search.count ? [...dataNonProd, ...dataProd] : []
}
