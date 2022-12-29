<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { parseFileUrl } from '$lib/files'

	const dispatch = createEventDispatcher()
	const remove = (event: Event) => {
		try {
			const target = event.target as HTMLButtonElement
			const index = target.value ? parseInt(target.value) : -1

			if (index >= 0) dispatch('remove', cartItems[index])
		} catch (ignored) {}
	}

	export let cartItems: CartItem[]
</script>

<div class="overflow-x-auto relative rounded-lg border-gray-100 border">
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
		<tbody class="divide-y divide-y-gray-100">
			{#each cartItems as cartItem, index}
				<tr class="bg-white">
					<td class="p-2 w-32">
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
					<td class="py-3 px-6 font-semibold text-gray-800">
						P {cartItem.expand?.product.price}
					</td>
					<td class="py-3 px-6 w-28">
						<button
							type="button"
							value={index}
							class="font-medium text-red-600 hover:underline"
							on:click={remove}>
							Remove
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
