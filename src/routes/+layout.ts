import pocketbase from '$lib/backend'
import { error } from '@sveltejs/kit'
import type { ListResult } from 'pocketbase'

export async function load() {
	try {
		const userId = pocketbase.authStore.model?.id

		const result: ListResult<App.CartItem> = await pocketbase.collection('carts').getList(1, 50, {
			filter: `user="${userId}"`,
			expand: 'product'
		})

		return {
			cartItems: result.items
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Error')
	}
}
