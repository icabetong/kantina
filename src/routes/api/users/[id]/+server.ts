import { ClientResponseError } from 'pocketbase'
import { type RequestHandler, error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const id = params.id
		const user = await request.json()

		await pocketbase.collection('users').update(id, user)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
