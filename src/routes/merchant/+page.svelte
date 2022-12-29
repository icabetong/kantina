<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { createForm } from 'svelte-forms-lib'
	import { openModal } from 'svelte-modals'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, Plus, BuildingStorefront, XMark } from '@steeze-ui/heroicons'
	import Pagination from '$components/pagination/Pagination.svelte'
	import ProductTable from '$components/product-table/ProductTable.svelte'
	import ProductModal from '$components/modals/product-editor/ProductEditor.svelte'
	import ConfirmationModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import StoreProperties from '$components/modals/store-properties/StoreProperties.svelte'
	import pocketbase from '$lib/backend'
	import type { PageData } from './$types'

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
	let products: Product[] = []
	let userStore: Store
	let totalItems: number
	let totalPages: number
	let currentPage: number
	let perPage: number

	const onTriggerAdd = () => openModal(ProductModal, { store: userStore })
	const onTriggerEdit = (product: Product) => {
		openModal(ProductModal, {
			product,
			store: userStore
		})
	}
	const onTriggerRemove = (product: Product) => {
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

	const onPageChange = (page: number) => {
		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', page.toString())

		goto(destinationURL, { replaceState: true })
	}
	const onFormReset = () => {
		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.delete('query')

		goto(destinationURL, { replaceState: true })
	}
	const { form, handleSubmit } = createForm({
		initialValues: {
			query: ''
		},
		onSubmit: async (form) => {
			if (!form.query) return

			const destinationURL = new URL($page.url)
			const urlParams = destinationURL.searchParams
			urlParams.set('query', form.query)

			goto(destinationURL, { replaceState: true })
		}
	})

	const onSearchQueryChanged = (event: KeyboardEvent) => {
		if (event.code === 'Enter' || event.code === 'Backspace') {
			const query: string =
				event.target && 'value' in event.target ? (event.target.value as string) : ''
			// use form to handle
			if (query.trim().length > 0) return

			const destinationURL = new URL($page.url)
			const urlParams = destinationURL.searchParams
			urlParams.delete('query')

			goto(destinationURL, { replaceState: true })
		}
	}
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
		<form
			class="w-1/2 flex-initial flex items-center justify-end"
			on:submit|preventDefault={handleSubmit}
			on:reset={onFormReset}>
			<label for="table-search" class="sr-only">Search</label>
			<div class="relative w-full md:w-fit">
				<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					<Icon src={MagnifyingGlass} class="w-5 h-5" />
				</div>
				<input
					type="text"
					id="table-search"
					class="block p-2.5 pl-10 pr-10 w-full md:w-80 text-sm text-gray-800 bg-white shadow rounded-lg border border-gray-300 ring-2 ring-transparent focus:ring-orange-500 focus:border-transparent focus:outline-none transition-all"
					placeholder="Search for items"
					on:keyup={onSearchQueryChanged}
					bind:value={$form.query} />
				{#if $form.query && $form.query.length > 0}
					<button
						type="reset"
						class="absolute inset-y-0 right-0 flex items-center m-2 p-1 rounded-lg hover:bg-gray-100">
						<Icon src={XMark} class="w-5 h-5" />
					</button>
				{/if}
			</div>
			<button
				type="submit"
				class="hidden p-2.5 ml-2 text-sm font-medium text-white bg-orange-500 rounded-lg border border-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300">
				<Icon src={MagnifyingGlass} class="w-5 h-5" />
				<span class="sr-only">Search</span>
			</button>
		</form>
	</div>
	<div class="flex-1 mt-6 w-full">
		<ProductTable {products} onProductClick={onTriggerEdit} onProductRemove={onTriggerRemove} />
		{#if products.length > 0}
			<Pagination
				hidePages={false}
				{totalPages}
				{currentPage}
				{perPage}
				{totalItems}
				{onPageChange}
				on:next={onNextList}
				on:previous={onPreviousList} />
		{/if}
	</div>
</div>

<svelte:head>
	<title>Merchant Center - Kantina</title>
</svelte:head>
