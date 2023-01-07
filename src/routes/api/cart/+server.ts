import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request }) => {
	try {
		const id = request.headers.get('owner-id')
		if (!id) throw error(400, 'Missing owner id')

		const cart = await pocketbase.collection('carts').getFullList<CartItem>(undefined, {
			expand: 'product',
			filter: `user = "${id}"`
		})
		return json({ cart })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { item } = await request.json()

		await pocketbase.collection('carts').create(item)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
