import { ClientResponseError } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = params.id
		const product = await pocketbase.collection('products').getOne(id, {
			expand: 'store'
		})
		return json({ product })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = params.id
		let product

		const type = request.headers.get('content-type')
		if (type === 'multipart/form-data') product = await request.formData()
		else product = await request.json()

		await pocketbase.collection('products').update(id, product)
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

		await pocketbase.collection('products').delete(id)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
