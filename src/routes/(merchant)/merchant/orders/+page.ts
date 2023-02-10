import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, fetch }) => {
	try {
		const userId = pocketbase.authStore.model?.id
		const page: number = parseInt(url.searchParams.get('page') ?? '1')
		const limit: number = parseInt(url.searchParams.get('limit') ?? '10')
		const status = url.searchParams.getAll('status')

		if (!userId) throw error(401, 'Authentication Required')

		const store: Store = await pocketbase.collection('stores').getFirstListItem(`owner="${userId}"`)

		const filter: string[] = status.map((k) => `status != "${k}"`)
		filter.push(`store = "${store.id}"`)

		const response = await fetch('/api/order/search', {
			method: 'POST',
			body: JSON.stringify({ page, limit, filter })
		})

		return await response.json()
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Server Error')
	}
}
