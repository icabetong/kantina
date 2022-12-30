import { error, redirect } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { LayoutLoad } from './$types'
import UserStore from '$stores/user'
import { authRoutes, privateRoutes } from '$shared/routes'

export const load = (async ({ url }) => {
	const pathname = url.pathname
	const model = pocketbase.authStore.model
	const isValid = pocketbase.authStore.isValid

	if (model && isValid) {
		if (authRoutes.includes(pathname))
			throw redirect(303, '/')

		try {
			const user = await pocketbase.collection('users').getOne<User>(model.id)
			UserStore.set(user)
	
			const basket: CartItem[] = await pocketbase.collection('carts').getFullList(undefined, {
				filter: `user="${model.id}"`,
				expand: 'product'
			})
			return {
				cart: basket
			}
		} catch (e) {
			if (e instanceof Error) throw error(401, 'Unauthorized')
	
			throw error(500, 'Internal Server Error')
		}
	} else {
		if (privateRoutes.includes('pathname')) {
			throw redirect(303, '/')
		}

		return {
			cart: []
		}
	}
}) satisfies LayoutLoad
