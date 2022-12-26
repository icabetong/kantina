import pocketbase from '$lib/backend'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ url }) => {
	try {
		const searchParams = url.searchParams
		const page = parseInt(searchParams.get('page') ?? '1')

		const result = await pocketbase.collection('products').getList(page, 50)

		return {
			items: result.items,
			count: result.totalItems,
			pages: result.totalPages,
			page: result.page,
			paginated: result.perPage
		}
	} catch (e) {
		if (e instanceof Error) throw error(e.status ?? 404, e.message)

		throw error(500, 'Internal Error')
	}
}) satisfies PageLoad
