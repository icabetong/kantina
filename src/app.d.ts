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
		collectionId: string
		collectionName: string
		created: Date
		updated: Date
		email?: string
		emailVisibility: boolean
		username: string
		verified: boolean
	}
}
