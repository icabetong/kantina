import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
	try {
		const data = await parent()
		const cart: CartItem[] = 'cart' in data ? (data['cart'] as CartItem[]) : []

		const stores: Store[] = []
		for (const item of cart) {
			const id = item.expand?.product.store
			if (!id) continue

			const response = await fetch(`/api/store/${id}`, {
				method: 'GET'
			})
			const { store } = await response.json()
			stores.push(store)
		}

		return {
			stores
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Server Error')
	}
}
