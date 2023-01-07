import { ClientResponseError, ListResult } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	try {
		const urlParams = url.searchParams
		const page = parseInt(urlParams.get('page') ?? '1')
		const limit = parseInt(urlParams.get('limit') ?? '10')
		const id = urlParams.get('id')

		const data: ListResult<Rating> = await pocketbase
			.collection('ratings')
			.getList(page, limit, { filter: `product="${id}"`, expand: 'user' })

		return json({
			ratings: data.items,
			count: data.totalItems,
			pages: data.totalPages,
			page: data.page,
			paginated: data.perPage
		})
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { rating } = await request.json()

		await pocketbase.collection('ratings').create(rating)

		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
