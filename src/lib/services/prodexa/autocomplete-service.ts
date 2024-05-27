import { error } from '@sveltejs/kit'
import { post } from '$lib/utils/api'
import { mapProdexaAutocomplete } from './prodexa-utils'

export const fetchAutocompleteData = async ({ origin, q }: any) => {
	try {

		// search by product
		const res = await post(
			`products/search/short-product?searchValue=${q}&page=0&size=10`,
			{
				'searchParams': {},
				'facetParams': {}
			},
			origin
		)

		const data = res?.content?.map((product: any) => mapProdexaAutocomplete(product))

		const search = {
			'count': res?.totalElements,
			'type': 'search',
			'key': q
		}

		return [search, ...data] || [search]
	} catch (e) {
		error(e.status, e.message)
	}
}