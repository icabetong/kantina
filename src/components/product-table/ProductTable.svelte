<script lang="ts">
	import EmptyView from '$components/empty-view/EmptyView.svelte'
	import { RocketLaunch } from '@steeze-ui/heroicons'

	export let products: App.Product[]
	export let onProductClick = (product: App.Product) => {}
	export let onProductRemove = (product: App.Product) => {}
</script>

<div class="overflow-x-auto relative rounded-lg border border-gray-200 shadow">
	{#if products.length > 0}
		<table class="w-full text-sm text-left text-gray-500">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
				<tr>
					<th scope="col" class="py-3 px-6"> Product </th>
					<th scope="col" class="py-3 px-6"> Category </th>
					<th scope="col" class="py-3 px-6"> Price </th>
					<th scope="col" class="py-3 px-6"> Quantity </th>
					<th scope="col" class="py-3 px-6"> Status </th>
					<th scope="col" class="py-3 px-6"> Actions </th>
				</tr>
			</thead>
			<tbody>
				{#each products as product, i}
					<tr
						class={`bg-white hover:bg-gray-50 ${
							products.length - 1 > i ? 'border-b' : ''
						} cursor-pointer`}
						on:click={() => onProductClick(product)}>
						<th scope="row" class="py-4 px-6 font-medium text-gray-800 whitespace-nowrap ">
							{product.name}
						</th>
						<td class="py-4 px-6"> {product.category}</td>
						<td class="p-4 font-medium text-gray-800">
							{#if product.currentPrice}
								<span class="line-through text-gray-400">
									₱{product.price}
								</span>
								<span class="ml-1">₱{product.currentPrice}</span>
							{:else}
								<span>₱{product.price}</span>
							{/if}
						</td>
						<td class="py-4 px-6">
							{#if product.quantity < 1}
								<span class="badge-red hidden lg:inline-block">Out of Stock!</span>
								<span class="badge-red lg:hidden">0</span>
							{:else}
								<span class={product.quantity <= 10 ? 'text-orange-500' : 'inherit'}>
									{product.quantity}
								</span>
							{/if}
						</td>
						<td class="py-4 px-6">
							{#if product.visible}
								<span class="badge-green">Visible</span>
							{:else}
								<span class="badget-yellow"> Hidden </span>
							{/if}
						</td>
						<td class="py-2 px-6">
							<button
								type="button"
								class="link text-red-500 px-2 py-2 rounded-lg"
								on:click|stopPropagation={() => onProductRemove(product)}>
								Remove
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
