import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, fetch }) => {
	try {
		const urlParams = url.searchParams
		const page = parseInt(urlParams.get('page') ?? '1')
		const limit = parseInt(urlParams.get('limit') ?? '10')
		const category = urlParams.get('category')
		const minimum = urlParams.get('minimum')
		const maximum = urlParams.get('maximum')

		const filter: string[] = []
		if (category && category !== 'all') filter.push(`category="${category}"`)
		if (minimum) filter.push(`price >= "${minimum}"`)
		if (maximum) filter.push(`price <= "${maximum}"`)

		const response = await fetch('/api/product/search', {
			method: 'POST',
			body: JSON.stringify({ page, limit, filter })
		})
		const data = await response.json()

		return data
	} catch (e) {
		console.error(e)
		if (e instanceof Error) throw error(404, e.message)

		throw error(500, 'Internal Server Error')
	}
}
