<script lang="ts">
	import { parseFileUrl } from '$lib/files'

	export let product: Product
</script>

<a
	href={`/product/${product.id}`}
	class="rounded-lg flex flex-col flex-wrap items-start p-3 bg-white border border-gray-100 transitions-all hover:border-orange-500 hover:shadow-md">
	{#if product.image}
		<div class="bg-gradient-to-br from-orange-500 to-pink-500 py-4 rounded-lg">
			<img src={parseFileUrl('products', product.id, product.image)} alt={product.name} />
		</div>
	{/if}
	<h5
		class="flex-1 mt-4 text-md text-center font-semibold tracking-tight line-clamp-2 leading-tight">
		{product.name}
	</h5>
	<div class="w-full flex flex-col-reverse items-center md:flex-row md:items-end justify-center">
		<div class="flex-1 mt-2 font-bold text-xl">
			{#if product.currentPrice}
				<span class="line-through mr-2 font-medium text-gray-300">₱{product.price}</span><span
					>₱{product.currentPrice}</span>
			{:else}
				<div>₱{product.price}</div>
			{/if}
		</div>
		<div class="w-full justify-center inline-flex mt-2 px-2 md:w-32 md:mt-0 md:px-0 md:justify-end">
			{#if product.expand?.store.name}
				<div
					class=" bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded truncate max-w-full">
					{product.expand?.store.name}
				</div>
			{/if}
		</div>
	</div>
</a>
