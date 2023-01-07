<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import EmptyState from '$components/empty-state/EmptyState.svelte'
	import Pagination from '$components/pagination/Pagination.svelte'
	import PurchasesGrid from '$components/purchases-grid/PurchasesGrid.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	let orders: Order[] = []
	let currentPage: number
	let perPage: number
	let totalItems: number
	let totalPages: number

	$: {
		orders = data.orders
		currentPage = data.page
		perPage = data.perPage
		totalItems = data.count
		totalPages = data.pages
	}

	const onSelectOrder = (event: CustomEvent) => {
		const order: Order = event.detail
		goto(`/purchases/${order.id}`)
	}

	const previous = () => {
		if (currentPage - 1 <= 0) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage - 1}`)

		goto(destinationURL)
	}
	const next = () => {
		if (currentPage + 1 > totalPages) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage + 1}`)

		goto(destinationURL, { replaceState: true })
	}
</script>

<div class="page min-h-screen">
	<h1 class="page-header mb-6">Orders and Purchases</h1>
	<div class="h-full">
		{#if orders.length > 0}
			<PurchasesGrid {orders} on:select={onSelectOrder} />
			<div class="flex flex-col items-center mt-8">
				<Pagination
					{perPage}
					{totalItems}
					{totalPages}
					{currentPage}
					on:previous={previous}
					on:next={next} />
			</div>
		{:else}
			<EmptyState
				icon="images/empty-cart.svg"
				title="No Orders Yet"
				message="You haven't made any orders yet, but when you do, it will show up here." />
		{/if}
	</div>
</div>

<svelte:head>
	<title>Orders and Purchases - Kantina</title>
</svelte:head>
