import { writable } from 'svelte/store'
import pocketbase from '$lib/backend'

const UserStore = writable(pocketbase.authStore.model)
export default UserStore
