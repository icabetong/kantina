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

<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
	{#each orders as order}
		<li
			class="p-0.5 border border-gray-100 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 drop-shadow hover:drop-shadow-lg transition-all"
			on:click={() => onHandleSelect(order)}
			on:keydown={null}>
			<div class="h-full bg-white rounded-md p-4 flex flex-col">
				<dl>
					<dt class="font-semibold">Order ID: {order.id}</dt>
					<dd class="text-gray-500 text-sm">
						{dateFormatter.format(Date.parse(order.created))}
					</dd>
				</dl>
				{#if order.expand?.products}
					<ul class="pt-4 pb-2 mb-auto">
						{#each { length: 2 } as _, index}
							{#if order.expand.products[index]}
								<li class="w-full flex items-center gap-3">
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
											<div class="text-gray-500 text-sm mb-2 capitalize">
												{order.expand.products[index].category}
											</div>
										</dt>
										<dd class="text-sm flex items-center justify-between">
											{currencyFormatter.format(order.expand.products[index].price)}
											<span>Qty: {order.quantities[order.expand.products[index].id]}</span>
										</dd>
									</dl>
								</li>
							{/if}
						{/each}
						{#if order.expand.products.length > 2}
							<li class="text-gray-600 text-sm">
								and {order.expand.products.length - 2} more products
							</li>
						{/if}
					</ul>
					<div class="mt-auto pt-2 text-sm flex flex-col gap-2 border-t">
						<dl class="flex items-center justify-between">
							<dt>Store/Merchant</dt>
							<dd>{order.expand.store.name}</dd>
						</dl>
						<dl class="flex items-center justify-between">
							<dt>Status</dt>
							{#if order.status === 'completed'}
								<dl class="uppercase font-semibold badge-green">{order.status}</dl>
							{:else if order.status === 'paid'}
								<dl class="uppercase font-semibold badge-blue">{order.status}</dl>
							{:else if order.status === 'pending'}
								<dl class="uppercase font-semibold badge-yellow">{order.status}</dl>
							{:else if order.status === 'rejected'}
								<dl class="uppercase font-semibold badge-red">{order.status}</dl>
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
