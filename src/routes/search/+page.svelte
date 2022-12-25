<script lang="ts">
	import { page } from '$app/stores'
	import ProductCard from '$components/product-card/ProductCard.svelte'
	import SearchQueryStore from '$stores/search-query'

	let query: string | null = null

	page.subscribe((value) => {
		if (value.url.searchParams.has('query')) {
			query = value.url.searchParams.get('query')

			if (!!query) SearchQueryStore.update(() => query!)
		}
	})

	const products: App.ProductRecord[] = [
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
		},
		{
			id: '3',
			name: 'Chicken',
			category: 'food',
			price: 0,
			quantity: 20,
			created: Date.now(),
			updated: Date.now(),
			visible: true
		},
		{
			id: '4',
			name: 'Chicken',
			category: 'food',
			price: 0,
			quantity: 20,
			created: Date.now(),
			updated: Date.now(),
			visible: true
		},
		{
			id: '5',
			name: 'Chicken',
			category: 'food',
			price: 0,
			quantity: 20,
			created: Date.now(),
			updated: Date.now(),
			visible: true
		}
	]
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
