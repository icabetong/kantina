import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}

		try {
			await locals.pocketbase.collection('users').create({...data, type: 'customer', passwordConfirm: data.password})
			await locals.pocketbase.collection('users').authWithPassword(data.email, data.password)
		} catch (e) {
			console.error(e)
			throw e
		}

		throw redirect(303, '/')
	}
}
