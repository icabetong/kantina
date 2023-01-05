import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'
import { ClientResponseError } from 'pocketbase'

export const load = (async ({ params }) => {
	try {
		const product = await pocketbase.collection('products').getOne<Product>(params.id, {
			expand: 'store'
		})
		const result = await pocketbase.collection('products').getList<Product>(1, 5, {
			filter: `category="${product.category}" && id != "${params.id}"`,
			expand: 'store'
		})

		return {
			product,
			related: result.items,
			ratings: await pocketbase.collection('ratings').getFullList<Rating>(undefined, {
				filter: `product="${params.id}"`,
				expand: 'user'
			})
		}
	} catch (e) {
		if (e instanceof ClientResponseError) {
			switch (e.status) {
				case 400: throw error(400, e.data.message)
				case 404: throw error(404, 'Product not found')
			}
		}

		throw error(500, 'Internal Server Error')
	}
}) satisfies PageLoad
