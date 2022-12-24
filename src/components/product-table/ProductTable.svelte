<script lang="ts">
	export let products: App.ProductRecord[] = [
		{
			id: '0',
			name: 'Chicken',
			category: 'food',
			price: 100,
			currentPrice: 20,
			quantity: 0,
			created: Date.now(),
			updated: Date.now(),
			visible: false
		},
		{
			id: '1',
			name: 'Chicken',
			category: 'food',
			price: 0,
			quantity: 8,
			created: Date.now(),
			updated: Date.now(),
			visible: true
		},
		{
			id: '2',
			name: 'Chicken',
			category: 'food',
			price: 0,
			quantity: 20,
			created: Date.now(),
			updated: Date.now(),
			visible: true
		}
	]

	export let onProductClick = (product: App.ProductRecord) => {}
	export let onProductRemove = (product: App.ProductRecord) => {}
</script>

<div class="overflow-x-auto relative rounded-lg border border-gray-200 shadow">
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
					class={`bg-white hover:bg-gray-50 ${products.length - 1 > i ? 'border-b' : ''}`}
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
							<span class="badge-red">Out of Stock!</span>
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
					<td class="py-4 px-6">
						<button
							type="button"
							class="link text-red-500"
							on:click|stopPropagation={() => onProductRemove(product)}>
							Remove
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
