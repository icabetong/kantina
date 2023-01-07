import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, fetch }) => {
	try {
		const userId = pocketbase.authStore.model?.id

		const urlParams = url.searchParams
		const query = urlParams.get('query')
		const page: number = parseInt(urlParams.get('page') ?? '1')
		const limit: number = parseInt(urlParams.get('limit') ?? '10')

		if (!userId) throw error(401, 'Authentication Required')

		const store: Store = await pocketbase.collection('stores').getFirstListItem(`owner="${userId}"`)
		const field: string = urlParams.get('field') ?? 'name'
		const direction = urlParams.get('direction')
		const hide = urlParams.get('hide')

		const filter: string[] = [`store = "${store.id}"`]
		if (query) filter.push(`name ~ "${query}"`)
		if (hide === 'true') filter.push(`visible = ${hide}`)

		const sort: string[] = []
		const directionToken = direction === 'descending' ? '-' : '+'
		if (field) sort.push(`${directionToken}${field}`)

		const response = await fetch('/api/product/search', {
			method: 'POST',
			body: JSON.stringify({ page, limit, filter, sort })
		})
		const data = await response.json()

		return {
			...data,
			store
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Server Error')
	}
}
