import type { PageLoad } from "./$types"
import { error } from '@sveltejs/kit'
import pocketbase from "$lib/backend"

export const load = (async () => {
try {
  const userId = pocketbase.authStore?.model?.id
  if (!userId) return

  return {
    store: await pocketbase.collection('stores').getFirstListItem<Store>(`owner="${userId}"`)
  }
} catch (e) {
  if (e instanceof Error) throw error(401, e.message)

	throw error(500, 'Internal Server Error')
}
}) satisfies PageLoad