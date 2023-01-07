import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = params.id
		const { item } = await request.json()

		await pocketbase.collection('carts').update(id, item)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = params.id

		await pocketbase.collection('carts').delete(id)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
