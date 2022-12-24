<script lang="ts">
	export let products: App.ProductRecord[] = [
		{ id: '0', name: 'Chicken', category: 'food', price: 100, currentPrice: 20, quantity: 0 },
		{ id: '1', name: 'Chicken', category: 'food', price: 0, quantity: 8 },
		{ id: '2', name: 'Chicken', category: 'food', price: 0, quantity: 20 }
	]

	export const handleRemove = () => {}
</script>

<div class="overflow-x-auto relative rounded-lg border border-gray-200 shadow">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
			<tr>
				<th scope="col" class="py-3 px-6"> Product </th>
				<th scope="col" class="py-3 px-6"> Category </th>
				<th scope="col" class="py-3 px-6"> Price </th>
				<th scope="col" class="py-3 px-6"> Quantity </th>
				<th scope="col" class="py-3 px-6"> Actions </th>
			</tr>
		</thead>
		<tbody>
			{#each products as product, i}
				<tr
					class={`bg-white hover:bg-gray-50 ${products.length - 1 > i ? 'border-b' : ''}`}
					on:click={() => console.log(product)}>
					<th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap ">
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
						<button on:click|stopPropagation={handleRemove} class="link text-red-500"
							>Remove</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
