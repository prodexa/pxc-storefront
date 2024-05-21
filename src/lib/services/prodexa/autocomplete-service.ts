import {error} from '@sveltejs/kit'
import {post} from '$lib/utils/api'
import {mapProdexajsAutocomplete} from "./prodexa-utils";

export const fetchAutocompleteData = async ({origin, storeId, q}: any) => {
  try {
    let res: any = {}
    let data = []

    // search by classifications
    // res = await getAPI(
    //   `/classifications/search/findAllByParams?page=0&size=10&classificationId=${q}`,
    //   origin
    // )
    // data = res?.content?.map((c) => mapProdexajsAutocomplete(c))

    // search by product
    res = await post(
      `/products/search?searchValue=${q}&page=0&size=10`,
      {
        "searchParams": {},
        "facetParams": {
        }
      },
      origin
    )
    data = res?.content?.map((c) => mapProdexajsAutocomplete(c))

    return data || []
  } catch (e) {
    error(e.status, e.message)
  }
}

// export const createComment = async (
// 	projectId: string
// ): Promise<CommentActionData> => {
// 	try {
// 		await post('comments',{})
// 		return {
// 			success: true
// 		};
// 	} catch (err) {
// 		const e = err as Error;
// 		throw error(e.status, e.data.message);
// 	}
// };

// export const updateComment = async (
// ): Promise<CommentActionData> => {
// 	try {
// 		await post('comments',{})
// 		return {
// 			success: true
// 		};
// 	} catch (err) {
// 		const e = err as Error;
// 		throw error(e.status, e.data.message);
// 	}
// };

// export const deleteComment = async (locals: App.Locals, id: string) => {
// 	try {
// 		await delete('comments','id')
// 	} catch (err) {
// 		if (err instanceof Error) {
// 			throw error(err.status, err.data.message);
// 		} else {
// 			throw error(500, 'Something went wrong while deleting your comment.');
// 		}
// 	}
// };
