import pocketbase from '$lib/backend'
import UserStore from '$stores/user'

pocketbase.authStore.loadFromCookie(document.cookie)
pocketbase.authStore.onChange(async () => {
	const model = pocketbase.authStore.model
	if (model) {
		const user = await pocketbase.collection('users').getOne<User>(model.id)
		UserStore.set(user)
		document.cookie = pocketbase.authStore.exportToCookie({ httpOnly: false })
	} else {
		document.cookie = ''
		UserStore.set(null)
	}
})

const model = pocketbase.authStore?.model
if (model)
	pocketbase
		.collection('users')
		.getOne<User>(model.id)
		.then((data) => UserStore.set(data))
