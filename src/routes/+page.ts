import type { ListResult } from 'pocketbase'
import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load = (async () => {
	try {
		const result: ListResult<Product> = await pocketbase.collection('products').getList(1, 5, {
			filter: 'visible = true',
			expand: 'store',
			sort: '+updated'
		})

		return {
			products: result.items
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Error')
	}
}) satisfies PageLoad