<script lang="ts">
	import { parseFileUrl } from '$lib/files'

	export let cartItems: CartItem[]
	export let onCartItemClick = (cartItem: CartItem) => {}
</script>

<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50">
			<tr>
				<th scope="col" class="py-3 px-6">
					<span class="sr-only">Image</span>
				</th>
				<th scope="col" class="py-3 px-6"> Product </th>
				<th scope="col" class="py-3 px-6"> Quantity </th>
				<th scope="col" class="py-3 px-6"> Price </th>
				<th scope="col" class="py-3 px-6"> Action </th>
			</tr>
		</thead>
		<tbody>
			{#each cartItems as cartItem}
				<tr class="bg-white border-b hover:bg-gray-50">
					<td class="p-4 w-32">
						{#if cartItem.expand?.product && cartItem.expand?.product.image}
							<img
								src={parseFileUrl('products', cartItem.product, cartItem.expand?.product.image)}
								alt={cartItem.expand?.product.name} />
						{/if}
					</td>
					<th class="py-3 px-6 font-semibold text-gray-800">
						<a class="hover:underline" href={`/product/${cartItem.product}`}>
							{cartItem.expand?.product.name}
						</a>
					</th>
					<td class="py-3 px-6"> {cartItem.quantity} </td>
					<td class="py-3 px-6 font-semibold text-gray-800"> {cartItem.expand?.product.price} </td>
					<td class="py-3 px-6 w-28">
						<button
							type="button"
							class="font-medium text-red-600 hover:underline"
							on:click={() => onCartItemClick(cartItem)}>
							Remove
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
