import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'
import type { ListResult } from 'pocketbase'

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('query')
	if (!searchQuery) throw error(401, 'Search Query Required')

	const result: ListResult<Product> = await pocketbase.collection('products').getList(1, 50, {
		filter: `name = "${searchQuery}"`
	})
	return {
		items: result.items
	}
}) satisfies PageLoad
