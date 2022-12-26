<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { openModal } from 'svelte-modals'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, Plus, BuildingStorefront } from '@steeze-ui/heroicons'
	import type { PageData } from './$types'
	import Pagination from '$components/pagination/Pagination.svelte'
	import ProductTable from '$components/product-table/ProductTable.svelte'
	import ProductModal from '$components/modals/product-editor/ProductEditor.svelte'
	import ConfirmationModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import StoreProperties from '$components/modals/store-properties/StoreProperties.svelte'
	import pocketbase from '$lib/backend'

	export let data: PageData

	$: {
		const { items, store, page, paginated, count, pages } = data
		products = items
		userStore = store
		currentPage = page
		perPage = paginated
		totalItems = count
		totalPages = pages
	}
	let products: App.Product[] = []
	let userStore: App.Store
	let totalItems: number
	let totalPages: number
	let currentPage: number
	let perPage: number

	const onTriggerAdd = () => openModal(ProductModal, { store: userStore })
	const onTriggerEdit = (product: App.Product) => {
		openModal(ProductModal, {
			product,
			store: userStore
		})
	}
	const onTriggerRemove = (product: App.Product) => {
		openModal(ConfirmationModal, {
			title: `Remove ${product.name}`,
			message: `Are you sure you want to remove this product from your store? This action cannot be undone.`,
			confirmText: 'Remove',
			abandonText: 'Cancel',
			confirm: async () => {
				try {
					await pocketbase.collection('products').delete(product.id)
					goto($page.url, { replaceState: true, invalidateAll: true })
				} catch (e) {
					console.error(e)
				}
			}
		})
	}

	const onPreviousList = () => {
		if (currentPage - 1 <= 0) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage - 1}`)

		goto(destinationURL)
	}
	const onNextList = () => {
		if (currentPage + 1 > totalPages) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage + 1}`)

		goto(destinationURL, { replaceState: true })
	}

	const onStorePropertiesTriggered = () => openModal(StoreProperties, { store: userStore })
</script>

<div class="page w-full min-h-screen flex flex-col items-center justify-center">
	<div class="w-full flex items-center justify-between mb-6">
		<h2 class="page-header text-start">Merchant Center</h2>
		<button
			class="btn-primary shadow inline-flex items-center transition-all"
			on:click={onTriggerAdd}>
			<Icon src={Plus} class="w-5 h-5 md:mr-2 -ml-1" />
			<span class="hidden md:inline-block">Add Product</span>
		</button>
	</div>
	<div class="w-full flex flex-row items-center">
		<div class="w-1/2 flex-initial flex items-center">
			<button
				type="button"
				class="btn-outlined flex flex-row items-center px-6 py-3"
				on:click={onStorePropertiesTriggered}>
				<Icon src={BuildingStorefront} class="h-5 w-5 md:mr-2" />
				<span class="hidden md:inline-block">Store Properties</span>
			</button>
		</div>
		<div class="w-1/2 flex-initial flex justify-end">
			<label for="table-search" class="sr-only">Search</label>
			<div class="relative w-full md:w-fit">
				<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					<Icon src={MagnifyingGlass} class="w-5 h-5" />
				</div>
				<input
					type="text"
					id="table-search"
					class="block p-2 pl-10 w-full md:w-80 text-sm text-gray-800 bg-white shadow rounded-lg border border-gray-300 ring-2 ring-transparent focus:ring-orange-500 focus:border-transparent focus:outline-none transition-all"
					placeholder="Search for items" />
			</div>
		</div>
	</div>
	<div class="flex-1 mt-6 w-full">
		<ProductTable {products} onProductClick={onTriggerEdit} onProductRemove={onTriggerRemove} />
		{#if products.length > 0}
			<Pagination
				{totalPages}
				{currentPage}
				{perPage}
				{totalItems}
				on:next={onNextList}
				on:previous={onPreviousList} />
		{/if}
	</div>
</div>

<svelte:head>
	<title>Merchant Center - Kantina</title>
</svelte:head>
