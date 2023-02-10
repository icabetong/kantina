import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, fetch }) => {
	try {
		const urlParams = url.searchParams
		const query = urlParams.get('query')
		const page = parseInt(urlParams.get('page') ?? '1')
		const limit = parseInt(urlParams.get('limit') ?? '10')
		const role = urlParams.get('role')
		const type = urlParams.get('type')

		const filter: string[] = []
		if (query) filter.push(`firstName ~ "${query}"`)
		if (query) filter.push(`lastName ~ "${query}"`)
		if (query) filter.push(`username ~ "${query}"`)
		if (role) filter.push(`role = "${role}"`)
		if (type) filter.push(`type = "${type}"`)

		const response = await fetch('/api/users', {
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
