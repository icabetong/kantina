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

<div class="flex-1 overflow-x-auto relative">
	{#if products.length > 0}
		<table class="w-full text-sm text-left text-gray-500">
			<thead class="text-xs uppercase bg-gray-100 text-gray-700">
				<tr>
					<th scope="col" class="py-3 px-6 rounded-l-lg">
						<span class="sr-only">Image</span>
					</th>
					<th scope="col" class="py-3 px-6">
						<button
							class="flex items-center text-xs uppercase"
							value="name"
							on:click={() => onProductSort('name')}>
							Product and Category
							{#if sort?.field === 'name'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="h-4 w-4 ml-2"
									theme="mini" />
							{:else}
								<div class="h-4 w-4 ml-2" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-3 px-6">
						<button
							class="flex items-center text-xs uppercase"
							value="price"
							on:click={() => onProductSort('price')}>
							Price
							{#if sort?.field === 'price'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="h-4 w-4 ml-2"
									theme="mini" />
							{:else}
								<div class="h-4 w-4  ml-2" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-3 px-6">
						<button
							class="flex items-center text-xs uppercase"
							value="quantity"
							on:click={() => onProductSort('quantity')}>
							Quantity
							{#if sort?.field === 'quantity'}
								<Icon
									src={sort?.direction === 'ascending' ? ChevronDown : ChevronUp}
									class="h-4 w-4 ml-2"
									theme="mini" />
							{:else}
								<div class="h-4 w-4 ml-2" />
							{/if}
						</button>
					</th>
					<th scope="col" class="py-3 px-6"> Status </th>
					<th scope="col" class="py-3 px-6 rounded-r-lg"> Actions </th>
				</tr>
			</thead>
			<tbody class="divide-y divide-y-gray-100">
				{#each products as product}
					<tr
						class="bg-white hover:bg-gray-50 rounded-lg cursor-pointer"
						on:click={() => onProductClick(product)}>
						<td class="p-2 w-32">
							{#if product.image}
								<img src={parseFileUrl('products', product.id, product.image)} alt={product.name} />
							{/if}
						</td>
						<th scope="row" class="py-2 px-6 font-medium text-gray-800 whitespace-nowrap ">
							{product.name}
							<p class="capitalize mt-1 text-gray-500 text-xs">{product.category}</p>
						</th>
						<td class="p-4 font-medium text-gray-800">
							{#if product.currentPrice}
								<span class="line-through text-gray-400">
									{formatter.format(product.price)}
								</span>
								<span class="ml-1">{formatter.format(product.currentPrice)}</span>
							{:else}
								<span>{formatter.format(product.price)}</span>
							{/if}
						</td>
						<td class="py-4 px-6">
							{#if product.quantity < 1}
								<span class="badge-red hidden xl:inline-block">Out of Stock!</span>
								<span class="xl:hidden text-red-500">0</span>
							{:else}
								<span class={product.quantity <= 10 ? 'text-orange-500' : 'inherit'}>
									{product.quantity}
								</span>
							{/if}
						</td>
						<td class="py-4 px-4">
							{#if product.visible}
								<span class="badge-green">Visible</span>
							{:else}
								<span class="badge-yellow">Hidden</span>
							{/if}
						</td>
						<td class="py-4 px-6">
							<button
								type="button"
								class="text-red-500 px-2 py-2 rounded-lg hover:bg-gray-100"
								on:click|stopPropagation={() => onProductRemove(product)}>
								<Icon src={Trash} class="w-5 h-5" />
							</button>
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
