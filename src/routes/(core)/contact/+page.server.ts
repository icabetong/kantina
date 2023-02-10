import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			name: string
			email: string
			phone: string
			description: string
		}

		try {
			await locals.pocketbase.collection('feedbacks').create(data)

			return { success: true }
		} catch (e) {
			console.error(e)
			throw e
		}
	}
}
