import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { products, order, cart } = await request.json()
		const basket: CartItem[] = cart
		const orderedProducts: { [key: string]: number } = products

		for (const [key, value] of Object.entries(orderedProducts)) {
			const product = await pocketbase.collection('products').getOne(key)
			const quantity = product.quantity - value
			await pocketbase.collection('products').update(key, { quantity })
		}
		for (const item of basket) {
			await pocketbase.collection('carts').delete(item.id)
		}

		await pocketbase.collection('orders').create(order)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		throw error(401, 'Internal Server Error')
	}
}
