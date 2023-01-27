import { json } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params }) => {
	try {
		const id = params.id

		const { role } = await pocketbase
			.collection('ids')
			.getFirstListItem<{ idNumber: string; role: string }>(`idNumber = "${id}"`)

		return json({ id, role })
	} catch (e) {
		console.error(e)
		return json({ e })
	}
}
