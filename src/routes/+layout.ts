import { error, redirect } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { LayoutLoad } from './$types'
import UserStore from '$stores/user'

export const load = (async ({ url }) => {
	const pathname = url.pathname
	const user = pocketbase.authStore.model
	const isValid = pocketbase.authStore.isValid

	if ((pathname.includes('/login') || pathname.includes('/register')) && user && isValid)
		throw redirect(301, '/account')

	try {
		const userId = pocketbase.authStore.model?.id

		if (userId) {
			const user = await pocketbase.collection('users').getOne<User>(userId)
			UserStore.set(user)
	
			const basket: CartItem[] = await pocketbase.collection('carts').getFullList(undefined, {
				filter: `user="${userId}"`,
				expand: 'product'
			})
			return {
				cartItems: basket
			}
		} else {
			return {
				cartItems: []
			}
		}
	} catch (e) {
		if (e instanceof Error) throw error(401, 'Unauthorized')

		throw error(500, 'Internal Server Error')
	}

}) satisfies LayoutLoad
