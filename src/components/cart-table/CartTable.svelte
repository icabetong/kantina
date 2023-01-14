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

<div class="relative overflow-x-auto rounded-lg border border-gray-100">
	<table class="w-full text-left text-sm text-gray-500">
		<thead class="bg-gray-50 text-xs uppercase text-gray-700">
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
		<tbody class="divide-y-gray-100 divide-y">
			{#each cartItems as cartItem, index}
				<tr class="bg-white">
					<td class="w-32 p-2">
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
					<td class="w-28 py-3 px-6">
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
