import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const id = params.id
		if (!id) throw error(415, 'Missing prerequisites')

		const response = await fetch(`/api/order/${id}`, { method: 'GET' })

		return await response.json()
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Server Error')
	}
}
