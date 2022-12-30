import type { ListResult } from 'pocketbase'
import { error } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import UserStore from '$stores/user'

export async function load() {
	try {
		if (pocketbase.authStore.isValid) {
			const userId = pocketbase.authStore.model?.id
			if (!userId) return

			const user = await pocketbase.collection('users').getOne<User>(userId)
			UserStore.set(user)
		}

		const result: ListResult<Product> = await pocketbase.collection('products').getList(1, 5, {
			filter: 'visible = true',
			expand: 'store'
		})

		return {
			products: result.items
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, e.message)

		throw error(500, 'Internal Error')
	}
}
