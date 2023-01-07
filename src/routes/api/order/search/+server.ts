import { ClientResponseError, type RecordListQueryParams } from 'pocketbase'
import { error, json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { page, limit, filter, sort } = await request.json()

		const queryParams: RecordListQueryParams = {
			expand: 'store,products,customer'
		}

		if (filter && filter.length) queryParams.filter = filter.join(' && ')
		if (sort && sort.length) queryParams.sort = sort.join(' && ')

		const data = await pocketbase.collection('orders').getList(page, limit, queryParams)

		return json({
			orders: data.items,
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
