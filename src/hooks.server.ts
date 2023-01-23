import type { Handle } from '@sveltejs/kit'
import clone from 'just-clone'
import pocketbase from '$lib/backend'

export const handle: Handle = async ({ event, resolve }) => {
	// before
	pocketbase.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
	let user: User | null = null
	if (pocketbase.authStore.isValid) {
		try {
			await pocketbase.collection('users').authRefresh()

			const id = pocketbase.authStore.model?.id
			if (!id) throw Error('What')

			user = await pocketbase.collection('users').getOne<User>(id)
		} catch (_) {
			pocketbase.authStore.clear()
		}
	}

	event.locals.pocketbase = pocketbase
	event.locals.user = user ? clone<User>(user) : null

	const response = await resolve(event)

	// after
	response.headers.set('set-cookie', pocketbase.authStore.exportToCookie({ httpOnly: false }))

	return response
}
