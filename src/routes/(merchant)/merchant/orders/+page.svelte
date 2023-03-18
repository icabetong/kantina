<script lang="ts">
	import { onMount } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Checkbox from '$components/checkbox/Checkbox.svelte'
	import Dropdown from '$components/dropdown/Dropdown.svelte'
	import UpdateOrder from '$components/modals/order-details/OrderDetails.svelte'
	import OrderTable from '$components/order-table/OrderTable.svelte'
	import Pagination from '$components/pagination/Pagination.svelte'
	import Switch from '$components/switch/Switch.svelte'
	import type { PageData } from './$types'

	onMount(() => {
		const searchParams = $page.url.searchParams
		hidden = searchParams.getAll('status')
	})

	export let data: PageData
	$: {
		orders = data.orders
		currentPage = data.page
		perPage = data.paginated
		totalItems = data.count
		totalPages = data.pages
	}
	let orders: Order[] = []
	let totalItems: number
	let totalPages: number
	let currentPage: number
	let perPage: number
	let hideIdColumn: boolean = true
	let hidden: string[] = []

	const onOrderSelect = (event: CustomEvent) => openModal(UpdateOrder, { order: event.detail })

	const onHideRejected = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		onChangeVisibility('rejected', !checked)
	}
	const onHideStarted = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		onChangeVisibility('started', !checked)
	}
	const onHidePending = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		onChangeVisibility('pending', !checked)
	}
	const onHidePaid = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		onChangeVisibility('paid', !checked)
	}
	const onHideCompleted = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		onChangeVisibility('completed', !checked)
	}
	const onChangeVisibility = (field: string, checked: boolean) => {
		const url = $page.url
		const searchParams = url.searchParams

		if (checked) searchParams.append('status', field)
		else searchParams.delete('status')

		goto(url, { replaceState: true })
	}

	const onHide = (event: CustomEvent) => {
		const checked = event.detail && 'checked' in event.detail ? event.detail.checked : null
		hideIdColumn = checked
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
</script>

<div class="flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center p-8">
	<h2 class="page-header mb-6 self-start">Orders</h2>
	<div class="flex w-full items-center">
		<Dropdown>
			<Switch checked={hideIdColumn} label="Hide ID column" on:change={onHide} />
			<ul class="border-t border-gray-200 pt-2">
				<li>
					<Checkbox
						checked={!hidden.includes('rejected')}
						label="Show Rejected Orders"
						on:change={onHideRejected} />
				</li>
				<li>
					<Checkbox
						checked={!hidden.includes('started')}
						label="Show Started Orders"
						on:change={onHideStarted} />
				</li>
				<li>
					<Checkbox
						checked={!hidden.includes('pending')}
						label="Show Pending Orders"
						on:change={onHidePending} />
				</li>
				<li>
					<Checkbox
						checked={!hidden.includes('paid')}
						label="Show Paid Orders"
						on:change={onHidePaid} />
				</li>
				<li>
					<Checkbox
						checked={!hidden.includes('completed')}
						label="Show Completed Orders"
						on:change={onHideCompleted} />
				</li>
			</ul>
		</Dropdown>
	</div>
	<div class="mt-6 flex w-full flex-1 flex-col">
		<OrderTable {orders} showId={!hideIdColumn} on:select={onOrderSelect} />
		{#if orders.length > 0}
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
	<title>Orders - Merchant Center</title>
</svelte:head>
