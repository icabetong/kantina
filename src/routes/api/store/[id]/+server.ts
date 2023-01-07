import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = params.id

		const store = await pocketbase.collection('stores').getOne(id)

		return json({ store })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = params.id
		let data

		if (request.headers.get('content-type') === 'multipart/form-data') {
			data = await request.formData()

			await pocketbase.collection('stores').update(id, data)
		} else {
			const data = await request.json()

			await pocketbase.collection('stores').update(id, data.store)
		}

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
		await pocketbase.collection('stores').delete(id)

		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
