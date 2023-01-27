import { ClientResponseError } from 'pocketbase'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request, fetch }) => {
		const data = Object.fromEntries(await request.formData()) as {
			idNumber: string
			firstName: string
			lastName: string
			email: string
			password: string
		}

		const { idNumber, email, password } = data

		if (idNumber.trim().length <= 0) return fail(400, { invalid: 'ID Number is required' })

		if (!password || password.length < 8)
			return fail(400, { invalid: 'Password should have minimum length of 8' })

		const response = await fetch(`/api/account/verify/${data.idNumber}`, {
			method: 'POST'
		})
		const { role } = await response.json()

		try {
			await locals.pocketbase
				.collection('users')
				.create({ ...data, idNumber, role, type: 'customer', passwordConfirm: data.password })
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
