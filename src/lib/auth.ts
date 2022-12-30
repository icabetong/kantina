import pocketbase from '$lib/backend'

export async function authenticate(
	email: string,
	password: string,
	register = false,
	other: { [key: string]: unknown } = {}
) {
	if (register) {
		const user = { ...other, email, password, passwordConfirm: password }
		await pocketbase.collection('users').create<User>(user)

		await pocketbase.collection('users').authWithPassword(email, password)
	} else await pocketbase.collection('users').authWithPassword(email, password)
}

export function endSession() {
	pocketbase.authStore.clear()
}
