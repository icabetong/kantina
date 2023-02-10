<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { openModal } from 'svelte-modals'
	import { MagnifyingGlass, Plus, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Dropdown from '$components/dropdown/Dropdown.svelte'
	import ConfirmationModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import ProductModal from '$components/modals/product-editor/ProductEditor.svelte'
	import Pagination from '$components/pagination/Pagination.svelte'
	import ProductTable from '$components/product-table/ProductTable.svelte'
	import Switch from '$components/switch/Switch.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: {
		products = data.products
		totalItems = data.count
		totalPages = data.pages
		currentPage = data.page
		perPage = data.paginated
		store = data.store
	}
	let products: Product[] = []
	let store: Store
	let totalItems: number
	let totalPages: number
	let currentPage: number
	let perPage: number
	let sort: Kantina.ProductSort = { field: 'name', direction: 'ascending' }
	let hideItems: boolean = false

	const onTriggerAdd = () => openModal(ProductModal, { store: store })
	const onTriggerEdit = (event: CustomEvent) => {
		const product = event.detail
		openModal(ProductModal, {
			product,
			store: store
		})
	}
	const onTriggerRemove = (event: CustomEvent) => {
		const product = event.detail

		openModal(ConfirmationModal, {
			title: `Remove ${product.name}`,
			message: `Are you sure you want to remove this product from your store? This action cannot be undone.`,
			confirmText: 'Remove',
			abandonText: 'Cancel',
			confirm: async () => {
				try {
					await fetch(`/api/product/${product.id}`, { method: 'DELETE' })
					goto($page.url, { replaceState: true, invalidateAll: true })
				} catch (e) {
					toast.push('Error removing product')
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

	const onPageChange = (event: CustomEvent) => {
		const newPage = event.detail

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', newPage)

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
	const onSort = (event: CustomEvent) => {
		const field = event.detail

		if (sort.field === field) {
			if (sort.direction === 'ascending') sort.direction = 'descending'
			else sort.direction = 'ascending'
		}

		if (field === 'name' || field === 'price' || field === 'quantity') sort.field = field

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		if (sort.field && sort.direction) {
			urlParams.set('field', sort.field)
			urlParams.set('direction', sort.direction)
		} else {
			urlParams.delete('field')
			urlParams.delete('direction')
		}

		goto(destinationURL, { replaceState: true })
	}

	const onHide = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null

		if (checked === null || checked === undefined) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('hide', checked.toString())

		goto(destinationURL, { replaceState: true })
	}
</script>

<div class="flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center p-8">
	<div class="mb-6 flex w-full items-center justify-between">
		<h2 class="page-header text-start">Products</h2>
		<button
			class="btn-primary inline-flex items-center shadow transition-all"
			on:click={onTriggerAdd}>
			<Icon src={Plus} class="-ml-1 h-5 w-5 md:mr-2" />
			<span class="hidden md:inline-block">Add Product</span>
		</button>
	</div>
	<div class="flex w-full items-center">
		<div class="flex w-1/2 flex-initial items-center">
			<Dropdown>
				<Switch checked={hideItems} label="Hide publicly hidden items" on:change={onHide} />
			</Dropdown>
		</div>
		<div class="flex w-1/2 flex-initial items-center justify-end gap-2">
			<form on:submit|preventDefault={handleSubmit} on:reset={onFormReset}>
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative w-full md:w-fit">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon src={MagnifyingGlass} class="h-5 w-5" />
					</div>
					<input
						type="text"
						id="table-search"
						class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 pr-10 text-sm text-gray-800 shadow ring-2 ring-transparent transition-all focus:border-transparent focus:outline-none focus:ring-red-500 md:w-80"
						placeholder="Search for items"
						on:keyup={onSearchQueryChanged}
						bind:value={$form.query} />
					{#if $form.query && $form.query.length > 0}
						<button
							type="reset"
							class="absolute inset-y-0 right-0 m-2 flex items-center rounded-lg p-1 hover:bg-gray-100">
							<Icon src={XMark} class="h-5 w-5" />
						</button>
					{/if}
				</div>
				<button
					type="submit"
					class="ml-2 hidden rounded-lg border border-red-500 bg-red-500 p-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300">
					<Icon src={MagnifyingGlass} class="h-5 w-5" />
					<span class="sr-only">Search</span>
				</button>
			</form>
		</div>
	</div>
	<div class="mt-6 flex w-full flex-1 flex-col">
		<ProductTable
			{products}
			{sort}
			on:sort={onSort}
			on:select={onTriggerEdit}
			on:remove={onTriggerRemove} />
		{#if products.length > 0}
			<Pagination
				hidePages={false}
				{totalPages}
				{currentPage}
				{perPage}
				{totalItems}
				on:change={onPageChange}
				on:next={onNextList}
				on:previous={onPreviousList} />
		{/if}
	</div>
</div>

<svelte:head>
	<title>Products - Merchant Center</title>
</svelte:head>
