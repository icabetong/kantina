import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'
import type { ListResult } from 'pocketbase'

export const load = (async ({ url }) => {
	try {
		const userId = pocketbase.authStore.model?.id
		const page: number = parseInt(url.searchParams.get('page') ?? '1')

		if (!userId) throw error(401, 'Authentication Required')

		const store: Store = await pocketbase.collection('stores').getFirstListItem(`owner="${userId}"`)
		const result: ListResult<Product> = await pocketbase.collection('products').getList(page, 50, {
			filter: `store="${store.id}"`
		})

		return {
			store: store,
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
