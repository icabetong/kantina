import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
	try {
		const urlParams = url.searchParams
		const page = parseInt(urlParams.get('page') ?? '1')
		const limit = parseInt(urlParams.get('limit') ?? '10')
		const query = urlParams.get('query')
		const category = urlParams.get('category')
		const minimum = urlParams.get('minimum')
		const maximum = urlParams.get('maximum')

		const filter: string[] = []
		if (query) filter.push(`name ~ "${query}"`)
		if (category && category !== 'all') filter.push(`category="${category}"`)
		if (minimum) filter.push(`price >= "${minimum}"`)
		if (maximum) filter.push(`price <= "${maximum}"`)

		if (!query) throw error(401, 'Search Query Required')
		const response = await fetch('/api/product/search', {
			method: 'POST',
			body: JSON.stringify({
				filter,
				page,
				limit
			})
		})
		const data = await response.json()

		return data
	} catch (e) {
		throw error(500, 'Internal Server Error')
	}
}
