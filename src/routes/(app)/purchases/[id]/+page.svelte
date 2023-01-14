<script lang="ts">
	import { page } from '$app/stores'
	import { parseFileUrl } from '$lib/files'
	import { getCurrencyFormatter, getDateTimeFormatter } from '$shared/formatter'
	import type { PageData } from './$types'

	export let data: PageData
	const dateFormatter = getDateTimeFormatter('short', 'short')
	const currencyFormatter = getCurrencyFormatter()
	const order = data.order
	const products = order.expand?.products ?? []

	const id = $page.params.id
</script>

<div class="page mb-16">
	<h1 class="page-header">Order Details</h1>
	<div class="mt-8 flex flex-col gap-8 md:flex-row-reverse">
		<div class="mt-4 flex w-full flex-col md:mb-8 md:w-2/5 lg:w-1/4">
			<div class="divide-y-gray-100 flex-1 divide-y">
				<dl class="row">
					<dt class="row-title">Order ID:</dt>
					<dd class="row-value">{id}</dd>
				</dl>
				<dl class="row">
					<dt class="row-title">Store:</dt>
					<dd class="row-value">{order.expand?.store.name}</dd>
				</dl>
				<dl class="row">
					<dt class="row-title">Status:</dt>
					<dd class="row-value capitalize">
						{#if order.status === 'complete'}
							<span class="badge-green uppercase">{order.status}</span>
						{:else if order.status === 'paid'}
							<span class="badge-blue uppercase">{order.status}</span>
						{:else if order.status === 'pending'}
							<span class="badge-yellow uppercase">{order.status}</span>
						{:else}
							<span class="badge-red uppercase">{order.status}</span>
						{/if}
					</dd>
				</dl>
				{#if order.reference}
					<dl class="row">
						<dt class="row-title">Reference #</dt>
						<dd class="row-value">{order.reference}</dd>
					</dl>
				{/if}
				<dl class="row">
					<dl class="row-title">Order Placed:</dl>
					<dd class="row-value">{dateFormatter.format(Date.parse(order.created))}</dd>
				</dl>
				<dl class="row">
					<dl class="row-title">Last Modified:</dl>
					<dd class="row-value">{dateFormatter.format(Date.parse(order.updated))}</dd>
				</dl>
			</div>
			<div
				class="mt-4 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 pt-1 drop-shadow md:mt-0">
				<dl class="rounded-md bg-white p-6 drop-shadow">
					<dt class="text-sm text-gray-500">Order Total</dt>
					<dd class="text-2xl font-semibold">{currencyFormatter.format(order.total)}</dd>
				</dl>
			</div>
		</div>
		<div class="w-full md:w-3/5 lg:w-3/4">
			<h6 class="mb-4 rounded-lg bg-gray-200 py-2 px-4 text-sm font-semibold">Products Ordered:</h6>
			<ul class="divide-y rounded-lg border">
				{#each products as product}
					<li class="flex items-center gap-8 px-6 py-2 text-gray-500">
						<div>
							{#if product.image}
								<img
									src={parseFileUrl('products', product.id, product.image)}
									alt={`product image for ${product.name}`}
									width="144"
									height="112"
									class="h-24 w-24 object-cover md:h-28 md:w-auto" />
							{:else}
								<span>No Image</span>
							{/if}
						</div>
						<div class="flex flex-1 flex-col md:flex-row">
							<dl class="md:flex-1">
								<dt class="font-semibold text-gray-700 md:text-lg">{product.name}</dt>
								<dd class="text-sm md:text-base">Quantity: {order.quantities[product.id]}</dd>
							</dl>
							<div class="mt-2 text-lg font-medium text-gray-700 md:mt-0 md:text-xl">
								{currencyFormatter.format(product.price)}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<svelte:head>
	<title>Order Details - Kantina</title>
</svelte:head>

<style lang="postcss">
	.row {
		@apply flex items-center justify-between py-2;
	}
	.row-title {
		@apply text-sm uppercase text-gray-600;
	}
	.row-value {
		@apply font-medium;
	}
</style>
