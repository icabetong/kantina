import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const order = await pocketbase.collection('orders').getOne(params.id, {
			expand: 'customer,store,products'
		})

		return json({ order })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const { product } = await request.json()

		await pocketbase.collection('orders').update(params.id, product)

		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await pocketbase.collection('orders').delete(params.id)

		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
