import pocketbase from '$lib/backend'
import { error } from '@sveltejs/kit'
import type { ListResult } from 'pocketbase'

export async function load() {
	try {
		const result: ListResult<App.Product> = await pocketbase.collection('products').getList(1, 5, {
			filter: 'visible = true',
			expand: 'store'
		})

		return {
			products: result.items
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Error')
	}
}
