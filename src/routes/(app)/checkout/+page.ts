import pocketbase from "$lib/backend";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
  try {
    const data = await parent()
    const cart: CartItem[] = 'cartItems' in data ? data['cartItems'] as CartItem[] : []

    const stores: Store[] = []
    for (const item of cart) {
      const id = item.expand?.product.store
      if (!id) continue

      const store = await pocketbase.collection('stores').getOne<Store>(id, {expand: 'owner'})
      stores.push(store)
    }
    
    return {
      stores
    }
  } catch (e) {
    if (e instanceof Error) throw error(401, e.message)

    throw error(500, 'Internal Server Error')
  }
}) satisfies PageLoad