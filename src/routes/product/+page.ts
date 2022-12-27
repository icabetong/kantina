import pocketbase from '$lib/backend'
import { error } from '@sveltejs/kit'
import type { ListResult, RecordQueryParams } from 'pocketbase'
import type { PageLoad } from './$types'

export const load = (async ({ url }) => {
	try {
		const searchParams = url.searchParams
		const page = parseInt(searchParams.get('page') ?? '1')
		const category = searchParams.get('category') ?? 'all'
		const minPrice = searchParams.get('min')
		const maxPrice = searchParams.get('max')

		const queryParams: RecordQueryParams = { expand: 'store' }
		if (category !== 'all') queryParams.filter = `category="${category}"`
		if (minPrice) {
			if (queryParams.filter) queryParams.filter += ' && '
			queryParams.filter += `price >= "${minPrice}"`
		}
		if (maxPrice) {
			if (queryParams.filter) queryParams.filter += ' && '
			queryParams.filter += `price <= "${maxPrice}"`
		}

		const result: ListResult<Product> = await pocketbase
			.collection('products')
			.getList(page, 10, queryParams)

		return {
			items: result.items,
			count: result.totalItems,
			pages: result.totalPages,
			page: result.page,
			paginated: result.perPage
		}
	} catch (e) {
		if (e instanceof Error) throw error(e.status ?? 404, e.message)

		throw error(500, 'Internal Server Error')
	}
}) satisfies PageLoad
