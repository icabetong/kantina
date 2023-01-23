import { fail, redirect } from '@sveltejs/kit'
import { ClientResponseError } from 'pocketbase'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string
			password: string
		}

    const { email, password } = data

		try {
			await locals.pocketbase.collection('users').authWithPassword(email, password)
		} catch (e) {
			console.error(e)
      if (e instanceof ClientResponseError) {
        return fail(400, { incorrect: true })
      }

			throw e
		}

		throw redirect(303, '/')
	}
}
