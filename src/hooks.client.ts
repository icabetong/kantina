import pocketbase from '$lib/backend'
import UserStore from '$stores/user'

pocketbase.authStore.loadFromCookie(document.cookie)
pocketbase.authStore.onChange(async () => {
	const model = pocketbase.authStore.model
	if (model) {
		UserStore.set(await pocketbase.collection('users').getOne<User>(model.id))
		document.cookie = pocketbase.authStore.exportToCookie({ httpOnly: false })
	} else {
		UserStore.set(null)
		document.cookie = ''
	}
})
