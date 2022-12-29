import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'
import type { ListResult, RecordQueryParams } from 'pocketbase'

export const load = (async ({ url }) => {
	try {
		const searchParams = url.searchParams
		const searchQuery = searchParams.get('query')

		if (!searchQuery) throw error(401, 'Search Query Required')

		const page = parseInt(searchParams.get('page') ?? '1')
		const category = searchParams.get('category') ?? 'all'
		const minPrice = searchParams.get('min')
		const maxPrice = searchParams.get('max')

		const queryParams: RecordQueryParams = { expand: 'store', filter: `name ~ "${searchQuery}"` }

		if (category !== 'all') queryParams.filter += `&& category="${category}"`
		if (minPrice) queryParams.filter += `&& price >= "${minPrice}"`
		if (maxPrice) queryParams.filter += `&& price <= "${maxPrice}"`

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
		throw error(500, 'Internal Server Error')
	}
}) satisfies PageLoad
