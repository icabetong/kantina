import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
	try {
		return {
			product: await pocketbase.collection('products').getOne<Product>(params.id, {
				expand: 'store'
			}),
			ratings: await pocketbase.collection('ratings').getFullList<Rating>(undefined, {
				filter: `product="${params.id}"`,
				expand: 'user'
			})
		}
	} catch (e) {
		throw error(404, 'Product not found')
	}
}) satisfies PageLoad
