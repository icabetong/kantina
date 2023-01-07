import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/product/search', {
			method: 'POST',
			body: JSON.stringify({
				page: 1,
				limit: 5,
				filter: ['visible = true'],
				sort: ['+updated']
			})
		})

		const data = await response.json()
		return data
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Error')
	}
}
