// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	type Credentials = {
		email: string
		password: string
	}
	type User = {
		firstName: string
		lastName: string
		email: string
		type: string
	}
	type UserWithPassword = User & {
		password: string
	}
	type UserRecord = User & {
		id: string
		created: number
		updated: number
		username: string
		verified: boolean
	}
	type ProductRecord = {
		id: string
		name?: string
		currentPrice?: number
		price: number
		quantity: number
		category: 'food' | 'drink' | 'meal' | 'other'
		created: number
		updated: number
		visible: boolean
	}
	type Tab = {
		id: string
		title?: string
	}
}
