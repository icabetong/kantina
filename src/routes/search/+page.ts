import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { ListResult } from 'pocketbase'
import type { PageLoad } from './$types'

export async function load({ url }: PageLoad): Promise<{ products: ListResult<App.Product> }> {
	// try {
	const searchQuery = url.searchParams.get('query')
	if (!searchQuery) throw error(401, 'Kebab')

	return {
		products: await pocketbase.collection('products').getList(1, 50, {
			filter: `name = "${searchQuery}"`
		})
	}
	// } catch (e) {
	// 	if (e instanceof Error) throw error(401, e.message)

	// 	throw error(500, 'Internal Error')
	// }
}
