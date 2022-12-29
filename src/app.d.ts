// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
/// <reference types="@sveltejs/kit"/>
declare namespace App {}

declare namespace Kantina {
	type Tab = {
		id: string
		title?: string
		icon?: import('@steeze-ui/heroicons').IconSource
	}
	type ProductFilter = {
		category?: ProductCategory
		minPrice?: number
		maxPrice?: number
	}
	type ProductSort = {
		field?: 'name' | 'price' | 'quantity'
		direction?: 'ascending' | 'descending'
	}
	type ProductForm = {
		id: string
		name: string
		description?: string
		price: number
		currentPrice?: number
		quantity: number
		category: ProductCategory
		visible: boolean
		image?: File | string
	}
}

type ProductCategory = 'food' | 'drink' | 'meal' | 'other'
interface Credentials extends Record {
	email: string
	password: string
}
interface User extends Credentials {
	id: string
	firstName: string
	lastName: string
	created: number
	updated: number
	verified: boolean
	avatar?: string
}
interface Store extends Record {
	id: string
	owner: string
	name: string
	status: 'operational' | 'deactivated'
	color: string
}
interface Product extends Record {
	id: string
	name: string
	description?: string
	price: number
	currentPrice?: number
	quantity: number
	store: string
	category: ProductCategory
	created: number
	updated: number
	visible?: boolean
	image?: string | null
	expand?: {
		store: Store
	}
}
interface CartItem extends Record {
	id: string
	user: string
	product: string
	quantity: number
	created: number
	updated: number
	expand?: {
		user: User
		product: Product
	}
}
interface Rating extends Record {
	id: string
	rating: number
	user: string
	title: string
	description: string
	product: string
	created: number
	updated: number
	votes: number
	expand?: {
		user: User
		product: Product
	}
}
interface Order extends Record {
	id: string
	customer: string
	store: string
	status: string
	reference?: string
	products: string[]
	created: number
	updated: number
	expand?: {
		customer: User
		store: Store
	}
}

type TableEvent<T> = {
	select: T
	remove: T
	sort: string
}

declare namespace svelte.JSX {
	interface HTMLProps<T> {
		onclickOutside?: (e: CustomEvent) => void
	}
}
