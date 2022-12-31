import pocketbase from "$lib/backend";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ url, parent }) => {
  try {
    const data = await parent()
    const params = url.searchParams
    const page = parseInt(params.get('page') ?? '1')
    const id = data.user?.id

    if (!id) throw error(404, 'Unauthroized Access')

    const result = await pocketbase.collection('orders').getList<Order>(page, 10, {
      filter: `customer = "${id}"`,
      expand: 'customer,products,store'
    })

    return {
      items: result.items,
      count: result.totalItems,
			pages: result.totalPages,
			page: result.page,
			paginated: result.perPage
    }
  } catch (e) {
    if (e instanceof Error)
      throw error(403, e.message)

    throw error(500, 'Internal Server Error')
  }
}) satisfies PageLoad