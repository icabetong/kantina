import { ClientResponseError, ListResult, type RecordListQueryParams } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { page, limit, filter, sort } = await request.json()

		const queryParams: RecordListQueryParams = {
			expand: 'store'
		}

		if (filter && filter.length) queryParams.filter = filter.join(' && ')
		if (sort && sort.length) queryParams.sort = sort.join(' && ')

		const result: ListResult<Product> = await pocketbase
			.collection('products')
			.getList(page, limit, queryParams)

		return json({
			products: result.items,
			count: result.totalItems,
			pages: result.totalPages,
			page: result.page,
			paginated: result.perPage
		})
	} catch (e) {
		console.error(e)
		if (e instanceof ClientResponseError) return json({ error: e })

		throw error(500, 'Internal Server Error')
	}
}
