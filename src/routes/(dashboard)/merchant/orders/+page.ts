import pocketbase from "$lib/backend";
import { error } from "@sveltejs/kit";
import type { ListResult, RecordListQueryParams } from "pocketbase";
import type { PageLoad } from "./$types";

export const load = (async ({ url }) => {
  try {
    const userId = pocketbase.authStore.model?.id
		const page: number = parseInt(url.searchParams.get('page') ?? '1')

		if (!userId) throw error(401, 'Authentication Required')

    const params: RecordListQueryParams = { expand: 'store,products,customer' }

    const result: ListResult<Order> = await pocketbase
			.collection('orders')
			.getList(page, 50, params)

		return {
			items: result.items,
			count: result.totalItems,
			pages: result.totalPages,
			page: result.page,
			paginated: result.perPage
		}
  } catch (e) {
    if (e instanceof Error) throw error(401, e.message)

    throw error(500, 'Internal Server Error')
  }
}) satisfies PageLoad