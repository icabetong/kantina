// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	type Tab = {
		id: string
		title?: string
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
	}
	interface Product extends Record {
		id: string
		name: string
		description?: string
		price: number
		currentPrice?: number
		quantity: number
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

	interface WrappedData<T> {
		items: List<T>
		count: number // totalItems
		pages: number // totalPages
		page: number // currentPage
		paginated: number // perPage
	}
	interface MerchantPageData extends WrappedData<Product> {
		store: Store
	}

	interface ProductForm {
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
