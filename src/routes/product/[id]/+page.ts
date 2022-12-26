import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export async function load({ params }: PageLoad): Promise<{ product: App.Product }> {
	try {
		return {
			product: await pocketbase.collection('products').getOne(params.id, {
				expand: 'store'
			})
		}
	} catch (e) {
		throw error(404, {
			title: 'Product not found',
			message: "The product you are searching for is not found, maybe it isn't cooked yet?"
		})
	}
}
