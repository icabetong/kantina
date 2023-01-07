import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request }) => {
	try {
		const id = request.headers.get('owner-id')

		const store = await pocketbase.collection('stores').getFirstListItem(`owner = "${id}"`)

		return json({ store })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { store } = await request.json()

		await pocketbase.collection('stores').create(store)

		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
