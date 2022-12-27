<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import EmptyState from '$components/empty-state/EmptyState.svelte'
	import Pagination from '$components/pagination/Pagination.svelte'
	import ProductCard from '$components/product-card/ProductCard.svelte'
	import type { PageData } from './$types'

	onMount(() => {
		const params = $page.url.searchParams
		const category = params.get('category')
		const min = params.get('min')
		const max = params.get('max')

		if (
			category === 'food' ||
			category === 'drink' ||
			category === 'meal' ||
			category === 'other'
		) {
			filter.category = category
		}

		filter.minPrice = min ? parseInt(min) : undefined
		filter.maxPrice = max ? parseInt(max) : undefined
	})

	export let data: PageData
	let products: Product[]
	let currentPage: number
	let perPage: number
	let totalItems: number
	let totalPages: number

	$: {
		const { items, page, paginated, count, pages } = data
		products = items
		currentPage = page
		perPage = paginated
		totalItems = count
		totalPages = pages
	}

	const categories = ['food', 'drink', 'meal', 'other']
	const filter: Kantina.Filter = {}

	const onResetCategory = () => {
		filter.category = undefined

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.delete('category')

		goto(destinationURL)
	}
	const onHandleCategoryFilter = (event: Event) => {
		const category: string | null =
			event.target && 'value' in event.target ? (event.target?.value as string) : null

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		if (category) urlParams.set('category', category)
		else urlParams.delete('category')

		goto(destinationURL)
	}

	const onResetPriceFilter = () => {
		filter.maxPrice = undefined
		filter.minPrice = undefined

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.delete('min')
		urlParams.delete('max')

		goto(destinationURL)
	}
	const onHandleMinPriceFilter = (event: Event) => {
		const price: string | null =
			event.target && 'value' in event.target ? (event.target?.value as string) : null

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		if (price) urlParams.set('min', price)
		else urlParams.delete('min')

		goto(destinationURL)
	}
	const onHandleMaxPriceFilter = (event: Event) => {
		const price: string | null =
			event.target && 'value' in event.target ? (event.target?.value as string) : null

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		if (price) urlParams.set('max', price)
		else urlParams.delete('max')

		goto(destinationURL)
	}

	const previous = () => {
		if (currentPage - 1 <= 0) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage - 1}`)

		goto(destinationURL)
	}
	const next = () => {
		if (currentPage + 1 > totalPages) return

		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.set('page', `${currentPage + 1}`)

		goto(destinationURL, { replaceState: true })
	}
</script>

<div class="page w-full min-h-screen flex flex-col items-start justify-center">
	<h1 class="page-header">Browse Products</h1>
	<div class="flex w-full h-full gap-8 pb-16">
		<div
			class="flex-auto hidden my-4 rounded-lg bg-gray-100 border border-gray-200 md:block md:w-1/4 xl:w-1/5">
			<div class="p-4">
				<div class="filter-group">
					<div class="filter-group-label-container">
						<h6 class="filter-group-label">Category</h6>
						{#if filter.category}
							<button type="button" class="filter-reset" on:click={onResetCategory}> Reset </button>
						{/if}
					</div>
					{#each categories as category}
						<div class="form-control">
							<input
								type="radio"
								id={category}
								class="form-control-radio"
								value={category}
								on:change={onHandleCategoryFilter}
								bind:group={filter.category} />
							<label for={category} class="form-control-radio-label">{category}</label>
						</div>
					{/each}
				</div>
				<div class="filter-group">
					<div class="filter-group-label-container">
						<h6 class="filter-group-label">Price Range</h6>
						{#if filter.maxPrice || filter.minPrice}
							<button type="button" class="filter-reset" on:click={onResetPriceFilter}
								>Reset</button>
						{/if}
					</div>
					<div class="flex flex-col items-center justify-center lg:flex-row lg:gap-2.5">
						<div class="form-control-group">
							<label for="min-price" class="form-control-label">Minimum</label>
							<input
								type="number"
								id="min-price"
								class="form-control-input-dense"
								on:blur={onHandleMinPriceFilter}
								on:mouseleave={onHandleMinPriceFilter}
								bind:value={filter.minPrice} />
						</div>
						<div class="mt-4 hidden lg:block">&nbsp;-&nbsp;</div>
						<div class="form-control-group">
							<label for="max-price" class="form-control-label">Maximum</label>
							<input
								type="number"
								id="max-price"
								class="form-control-input-dense"
								on:blur={onHandleMaxPriceFilter}
								on:mouseleave={onHandleMaxPriceFilter}
								bind:value={filter.maxPrice} />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-auto w-full py-4 flex flex-col items-center md:w-3/4 xl:w-4/5">
			{#if products.length > 0}
				<div class="flex-1 flex flex-col items-center">
					<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
						{#each products as product}
							<ProductCard {product} />
						{/each}
					</div>
				</div>
				<Pagination
					{perPage}
					{totalItems}
					{totalPages}
					{currentPage}
					on:previous={previous}
					on:next={next} />
			{:else}
				<EmptyState
					icon="images/searching.svg"
					title="No Results Found"
					message="Try adjusting some of the filters to find what you are looking for." />
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	<title>Browse Products - Kantina</title>
</svelte:head>

<style lang="postcss">
	@tailwind components;

	@layer components {
		.filter-group {
			@apply w-full mb-3;
		}
		.filter-group-label-container {
			@apply flex items-center justify-between mb-2;
		}
		.filter-group-label {
			@apply font-semibold;
		}
		.filter-reset {
			@apply text-sm text-gray-500 font-normal hover:underline hover:text-orange-500;
		}
	}
</style>
