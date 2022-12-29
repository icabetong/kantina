import type { ListResult } from 'pocketbase'
import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'

export async function load() {
	try {
		const userId = pocketbase.authStore.model?.id

		const result: ListResult<CartItem> = await pocketbase.collection('carts').getList(1, 50, {
			filter: `user="${userId}"`,
			expand: 'product'
		})

		return {
			cartItems: result.items
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, 'Unauthorized')

		throw error(500, 'Internal Server Error')
	}
}
