<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { openModal } from 'svelte-modals'
	import { hide } from '@popperjs/core'
	import { MagnifyingGlass, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Dropdown from '$components/dropdown/Dropdown.svelte'
	import UpdateOrder from '$components/modals/order-details/OrderDetails.svelte'
	import OrderTable from '$components/order-table/OrderTable.svelte'
	import Switch from '$components/switch/Switch.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: {
		const { items } = data
		orders = items
	}
	let orders: Order[] = []
	let totalItems: number
	let totalPages: number
	let currentPage: number
	let perPage: number
	let hideIdColumn: boolean = true

	const onOrderSelect = (event: CustomEvent) => openModal(UpdateOrder, { order: event.detail })

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

	const onHide = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		hideIdColumn = checked
	}
</script>

<div class="max-w-screen-xl p-8 w-full min-h-screen flex flex-col items-center justify-center">
	<h2 class="page-header self-start mb-6">Orders</h2>
	<div class="w-full flex items-center">
		<div class="w-1/2 flex-initial flex items-center">
			<Dropdown>
				<Switch checked={hideIdColumn} label="Hide ID column" on:change={onHide} />
			</Dropdown>
		</div>
		<div class="w-1/2 flex-initial flex items-center justify-end gap-2">
			<form on:submit|preventDefault={handleSubmit} on:reset={onFormReset}>
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
	</div>
	<div class="flex-1 mt-6 w-full">
		<OrderTable {orders} showId={!hideIdColumn} on:select={onOrderSelect} />
	</div>
</div>

<svelte:head>
	<title>Orders - Merchant Center</title>
</svelte:head>
