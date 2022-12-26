import { writable } from 'svelte/store'
import pocketbase from '$lib/backend'
import type { Admin, Record } from 'pocketbase'

const UserStore = writable<Record | Admin | null>(pocketbase.authStore.model)
export default UserStore
