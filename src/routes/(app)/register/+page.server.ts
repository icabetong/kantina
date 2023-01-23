import { fail, redirect } from '@sveltejs/kit'
import { ClientResponseError } from 'pocketbase'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}

    const { email, password } = data

    if (!password || password.length < 8) return fail(400, { invalid: 'Password should have minimum length of 8' })
    
		try {
			await locals.pocketbase.collection('users').create({...data, type: 'customer', passwordConfirm: data.password})
			await locals.pocketbase.collection('users').authWithPassword(email, password)
		} catch (e) {
			console.error(e)
      if (e instanceof ClientResponseError) {
        return fail(400, { invalid: e.message })
      }

			throw e
		}

		throw redirect(303, '/')
	}
}
