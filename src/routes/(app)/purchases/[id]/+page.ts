import pocketbase from "$lib/backend";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  try {
    const id = params.id
    if (!id) throw error(415, 'Missing prerequisites')

    const order = await pocketbase.collection('orders').getOne<Order>(id, { expand: 'products,store,customer'})
    return { order }

  } catch (e) {
    if (e instanceof Error) throw error(401, e.message)

    throw error(500, 'Internal Server Error')
  }
}) satisfies PageLoad