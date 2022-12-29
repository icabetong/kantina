<script lang="ts">
	import OrderTable from '$components/order-table/OrderTable.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	const { items } = data
</script>

<div class="max-w-screen-xl p-8 w-full min-h-screen flex flex-col items-center justify-center">
	<h2 class="page-header self-start">Orders</h2>
	<div class="w-full flex items-center" />
	<div class="flex-1 mt-6 w-full">
		<OrderTable orders={items} />
	</div>
</div>

<svelte:head>
	<title>Orders - Merchant Center</title>
</svelte:head>
