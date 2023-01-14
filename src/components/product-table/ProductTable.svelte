<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { ChevronDown, ChevronUp, RocketLaunch, Trash } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import EmptyView from '$components/empty-state/EmptyState.svelte'
	import { parseFileUrl } from '$lib/files'
	import { getCurrencyFormatter } from '$shared/formatter'

	const formatter = getCurrencyFormatter(false)
	const dispatch = createEventDispatcher<TableEvent<Product>>()
	const onProductClick = (product: Product) => dispatch('select', product)
	const onProductRemove = (product: Product) => dispatch('remove', product)
	const onProductSort = (field: string) => dispatch('sort', field)

	export let products: Product[]
	export let sort: Kantina.ProductSort
</script>

<div class="relative mb-4 flex-1 overflow-x-auto rounded-lg border border-gray-100">
	{#if products.length > 0}
		<table class="w-full text-left text-sm text-gray-500">
			<thead class="border-b border-gray-100 text-xs uppercase text-gray-700">
				<tr>
					<th scope="col" class="py-2 px-4">
						<span class="sr-only">Image</span>
					</th>
					<th scope="col" class="py-2 px-4">
						<button
							class="flex items-center text-xs uppercase"
							value="name"
							on:click={() => onProductSort('name')}>
							Product and Category
							{#if sort?.field === 'name'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="ml-2 h-4 w-4"
									theme="mini" />
							{:else}
								<div class="ml-2 h-4 w-4" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-2 px-4">
						<button
							class="flex items-center text-xs uppercase"
							value="price"
							on:click={() => onProductSort('price')}>
							Price
							{#if sort?.field === 'price'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="ml-2 h-4 w-4"
									theme="mini" />
							{:else}
								<div class="ml-2 h-4  w-4" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-2 px-4">
						<button
							class="flex items-center text-xs uppercase"
							value="quantity"
							on:click={() => onProductSort('quantity')}>
							Quantity
							{#if sort?.field === 'quantity'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="ml-2 h-4 w-4"
									theme="mini" />
							{:else}
								<div class="ml-2 h-4 w-4" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-3 px-6"> Status </th>
					<th scope="col" class="py-3 px-6"> Actions </th>
				</tr>
			</thead>
			<tbody class="divide-y-gray-100 divide-y">
				{#each products as product}
					<tr
						class="cursor-pointer rounded-lg bg-white hover:bg-gray-50"
						on:click={() => onProductClick(product)}>
						<td class="w-32 p-2">
							{#if product.image}
								<img src={parseFileUrl('products', product.id, product.image)} alt={product.name} />
							{:else}
								<span class="badge-yellow">No Image</span>
							{/if}
						</td>
						<th scope="row" class="whitespace-nowrap py-2 px-6 font-medium text-gray-800 ">
							{product.name}
							<p class="mt-1 text-xs capitalize text-gray-500">{product.category}</p>
						</th>
						<td class="p-4 font-medium text-gray-800">
							{#if product.currentPrice}
								<span class="text-gray-400 line-through">
									{formatter.format(product.price)}
								</span>
								<span class="ml-1">{formatter.format(product.currentPrice)}</span>
							{:else}
								<span>{formatter.format(product.price)}</span>
							{/if}
						</td>
						<td class="py-2 px-4">
							{#if product.quantity < 1}
								<span class="badge-red hidden xl:inline-block">Out of Stock!</span>
								<span class="text-red-500 xl:hidden">0</span>
							{:else}
								<span class={product.quantity <= 10 ? 'text-orange-500' : 'inherit'}>
									{product.quantity}
								</span>
							{/if}
						</td>
						<td class="py-2 px-4">
							{#if product.visible}
								<span class="badge-green">Visible</span>
							{:else}
								<span class="badge-yellow">Hidden</span>
							{/if}
						</td>
						<td class="py-2 px-4">
							<div class="flex h-full items-center justify-center">
								<button
									type="button"
									class="rounded-lg px-2 py-2 text-red-500 hover:bg-gray-100"
									on:click|stopPropagation={() => onProductRemove(product)}>
									<Icon src={Trash} class="h-5 w-5" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<EmptyView
			icon={RocketLaunch}
			title="No Products"
			message="Before you can sell, you'll need to add your products first." />
	{/if}
</div>
