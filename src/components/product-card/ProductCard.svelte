<script lang="ts">
	export let product: App.ProductRecord
</script>

<a
	href={`/product/${product.id}`}
	class="flex flex-col px-2 py-4 items-center justify-center rounded-lg border border-gray-100 transition-all hover:border-orange-500 hover:shadow">
	<div class="text-md font-semibold">{product.name}</div>
	<div class="text-gray-600">
		{#if product.currentPrice}
			<span class="text-gray-400 line-through mr-2 font-normal">
				₱{product.price}
			</span>
			<span class="font-medium">₱{product.currentPrice}</span>
		{:else}
			₱{product.price}
		{/if}
	</div>
</a>
