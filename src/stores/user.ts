import { writable } from 'svelte/store'

const UserStore = writable<User | null>(null)
export default UserStore
