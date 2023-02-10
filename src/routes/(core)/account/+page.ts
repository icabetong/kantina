import { redirect } from '@sveltejs/kit'
import pocketbase from '$lib/backend'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
	const user = pocketbase.authStore.model
	const isValid = pocketbase.authStore.isValid

	if (!isValid && !user) throw redirect(303, '/')
}
