<script lang="ts">
	import { page } from '$app/stores'
	import ProductCard from '$components/product-card/ProductCard.svelte'
	import SearchQueryStore from '$stores/search-query'
	import type { PageData } from './$types'

	let query: string | null = null

	page.subscribe((value) => {
		if (value.url.searchParams.has('query')) {
			query = value.url.searchParams.get('query')

			if (!!query) SearchQueryStore.update(() => query!)
		}
	})

	export let data: PageData
	const { products: result } = data
	const products: App.Product[] = result.items.map((product) => product)
</script>

<div class="page w-full min-h-screen">
	<h1>Showing results for <span class="font-semibold">{query}</span></h1>
	<div class="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
</div>

<svelte:head>
	<title>Search Results for: {query}</title>
</svelte:head>
