import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, parent, fetch }) => {
	try {
		const data = await parent()
		const params = url.searchParams
		const page = parseInt(params.get('page') ?? '1')
		const limit = parseInt(params.get('limit') ?? '10')
		const id = data.user?.id

		if (!id) throw error(404, 'Unauthroized Access')

		const response = await fetch('/api/order/search', {
			method: 'POST',
			body: JSON.stringify({ page, limit, filter: [`customer = "${id}"`] })
		})

		return await response.json()
	} catch (e) {
		if (e instanceof Error) throw error(403, e.message)

		throw error(500, 'Internal Server Error')
	}
}
