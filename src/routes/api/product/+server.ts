import { ClientResponseError, ListResult, type RecordQueryParams } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	try {
		const urlParams = url.searchParams
		const page = parseInt(urlParams.get('page') ?? '1')
		const limit = parseInt(urlParams.get('limit') ?? '10')

		const data: ListResult<Product> = await pocketbase.collection('products').getList(page, limit)

		return json({
			products: data.items,
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
		const product = await request.formData()

		await pocketbase.collection('products').create(product)
		return json({ status: 200 })
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
