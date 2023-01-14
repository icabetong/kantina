<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { parseFileUrl } from '$lib/files'
	import { getCurrencyFormatter, getDateTimeFormatter } from '$shared/formatter'

	const currencyFormatter = getCurrencyFormatter()
	const dateFormatter = getDateTimeFormatter()
	export let orders: Order[]

	const dispatch = createEventDispatcher<{ select: Order }>()
	const onHandleSelect = (order: Order) => dispatch('select', order)
</script>

<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each orders as order}
		<li
			class="rounded-lg border border-gray-100 bg-gradient-to-br from-orange-500 to-pink-500 p-0.5 drop-shadow transition-all hover:drop-shadow-lg"
			on:click={() => onHandleSelect(order)}
			on:keydown={null}>
			<div class="flex h-full flex-col rounded-md bg-white p-4">
				<dl>
					<dt class="font-semibold">Order ID: {order.id}</dt>
					<dd class="text-sm text-gray-500">
						{dateFormatter.format(Date.parse(order.created))}
					</dd>
				</dl>
				{#if order.expand?.products}
					<ul class="mb-auto pt-4 pb-2">
						{#each { length: 2 } as _, index}
							{#if order.expand.products[index]}
								<li class="flex w-full items-center gap-3">
									<div class="w-2/5">
										{#if order.expand.products[index].image}
											<img
												src={parseFileUrl(
													'products',
													order.expand.products[index].id,
													order.expand.products[index].image ?? ''
												)}
												alt={order.expand.products[index].name}
												class="h-24 w-24 object-cover"
												width="96"
												height="96" />
										{/if}
									</div>
									<dl class="w-3/5">
										<dt class="font-medium">
											{order.expand.products[index].name}
											<div class="mb-2 text-sm capitalize text-gray-500">
												{order.expand.products[index].category}
											</div>
										</dt>
										<dd class="flex items-center justify-between text-sm">
											{currencyFormatter.format(order.expand.products[index].price)}
											<span>Qty: {order.quantities[order.expand.products[index].id]}</span>
										</dd>
									</dl>
								</li>
							{/if}
						{/each}
						{#if order.expand.products.length > 2}
							<li class="text-sm text-gray-600">
								and {order.expand.products.length - 2} more products
							</li>
						{/if}
					</ul>
					<div class="mt-auto flex flex-col gap-2 border-t pt-2 text-sm">
						<dl class="flex items-center justify-between">
							<dt>Store/Merchant</dt>
							<dd>{order.expand.store.name}</dd>
						</dl>
						<dl class="flex items-center justify-between">
							<dt>Status</dt>
							{#if order.status === 'completed'}
								<dl class="badge-green font-semibold uppercase">{order.status}</dl>
							{:else if order.status === 'paid'}
								<dl class="badge-blue font-semibold uppercase">{order.status}</dl>
							{:else if order.status === 'pending'}
								<dl class="badge-yellow font-semibold uppercase">{order.status}</dl>
							{:else if order.status === 'rejected'}
								<dl class="badge-red font-semibold uppercase">{order.status}</dl>
							{/if}
						</dl>
						<dl class="flex items-center justify-between">
							<dt>Order Total</dt>
							<dl class="font-semibold">{currencyFormatter.format(order.total)}</dl>
						</dl>
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>
