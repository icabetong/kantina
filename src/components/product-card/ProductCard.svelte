<script lang="ts">
	import { parseFileUrl } from '$lib/files'
	import { getColor100, getTextColor800 } from '$shared/color'
	import { getCurrencyFormatter } from '$shared/formatter'

	const formatter = getCurrencyFormatter(false)
	export let product: Product
</script>

<a
	href={`/product/${product.id}`}
	class="transitions-all flex flex-col flex-wrap items-start rounded-lg border border-gray-100 bg-white p-3 hover:border-red-500 hover:shadow-md">
	{#if product.image}
		<div class="rounded-lg bg-gradient-to-br from-red-600 to-orange-500 py-4">
			<img src={parseFileUrl('products', product.id, product.image)} alt={product.name} />
		</div>
	{/if}
	<h5
		class="text-md mt-4 flex-1 text-center font-semibold leading-tight tracking-tight line-clamp-2">
		{product.name}
	</h5>
	<div class="flex w-full flex-col-reverse items-center justify-between md:flex-row md:items-end">
		<div class="mt-2 flex-1 text-lg font-bold tracking-tighter">
			{#if product.currentPrice}
				<span class="text-md mr-1 font-medium text-gray-300 line-through">
					{formatter.format(product.price)}
				</span>
				<span>{formatter.format(product.currentPrice)}</span>
			{:else}
				<div>{formatter.format(product.price)}</div>
			{/if}
		</div>
		<div
			class="mt-2 inline-flex w-full justify-center truncate px-2 md:mt-0 md:w-32 md:justify-end md:px-0">
			{#if product.expand?.store.name}
				<div
					class={`${getColor100(product.expand?.store.color)} ${getTextColor800(
						product.expand?.store.color
					)} max-w-full truncate rounded px-2.5 py-0.5 text-xs font-semibold`}>
					{product.expand?.store.name}
				</div>
			{/if}
		</div>
	</div>
</a>
