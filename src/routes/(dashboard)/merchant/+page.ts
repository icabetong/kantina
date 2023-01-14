import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
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
}
