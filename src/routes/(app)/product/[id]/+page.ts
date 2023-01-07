import { ClientResponseError } from 'pocketbase'
import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, params, fetch }) => {
	try {
		let response = await fetch(`/api/product/${params.id}`, {
			method: 'GET'
		})
		const { product } = await response.json()

		response = await fetch('/api/product/search', {
			method: 'POST',
			body: JSON.stringify({
				filter: [`category="${product.category}"`, `id != "${params.id}"`]
			})
		})
		const data = await response.json()

		url.searchParams.append('id', params.id)
		response = await fetch('/api/rating?' + url.searchParams, {
			method: 'GET'
		})

		const { ratings } = await response.json()

		return {
			related: data.products,
			product,
			ratings
		}
	} catch (e) {
		if (e instanceof ClientResponseError) {
			switch (e.status) {
				case 400:
					throw error(400, e.data.message)
				case 404:
					throw error(404, 'Product not found')
			}
		}

		throw error(500, 'Internal Server Error')
	}
}
