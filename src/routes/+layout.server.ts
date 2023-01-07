import { error, redirect } from '@sveltejs/kit'
import { authRoutes, privateRoutes } from '$shared/routes'
import UserStore from '$stores/user'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
	const pathname = url.pathname

	if (locals.user) {
		if (authRoutes.includes(pathname)) {
			throw redirect(303, '/')
		}

		const user: User = JSON.parse(JSON.stringify(locals.user))
		UserStore.set(user)

		try {
			const response = await fetch('/api/cart', {
				method: 'GET',
				headers: {
					'owner-id': user.id
				}
			})
			const data = await response.json()

			return { user, cart: data.cart }
		} catch (e) {
			if (e instanceof Error) throw error(401, e.message)

			throw error(500, 'Internal Server Error')
		}
	} else {
		if (privateRoutes.includes(pathname)) {
			throw redirect(303, '/')
		}

		return { user: null, cart: [] }
	}
}
