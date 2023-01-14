<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { ArrowRight, MagnifyingGlass } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import ProductCard from '$components/product-card/ProductCard.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	const { products } = data

	let cartSize: number = 0
	let user = data.user

	$: cartSize = data.cart.length

	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			searchQuery: ''
		},
		onSubmit: (formData) => {
			$page.url.searchParams.set('query', formData.searchQuery)
			goto(`/search?${$page.url.searchParams.toString()}`)
		}
	})
</script>

<header class="z-10"><Navigation cartItems={cartSize} {user} /></header>
<main class="flex-1 bg-white">
	<div class="min-h-screen bg-white text-gray-800">
		<div class="hero border-b">
			<div class="page flex flex-col items-start justify-start py-12 md:items-center md:py-56">
				<h1 class="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
					Discover new stalls and{' '}
					<span class="bg-gradient-to-br from-red-600 to-orange-400 bg-clip-text text-transparent">
						food
					</span>
				</h1>
				<p class="text-md font-normal text-gray-500 lg:text-lg">
					Good food and drinks that are delicious that are affordable and with various choices.
				</p>
				<form class="mt-16 w-full md:w-3/4" on:submit|preventDefault={handleSubmit}>
					<label for="searchQuery" class="sr-only mb-2 text-sm font-medium text-gray-800">
						Search
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
						</div>
						<input
							type="search"
							id="searchQuery"
							class="block w-full rounded-lg bg-gray-50 p-4 pl-10 text-sm text-gray-800 outline outline-gray-300 transition-all focus:outline-2 focus:outline-red-600 focus:ring-red-600"
							placeholder="Search for food, drinks, menus or stalls..."
							required
							on:change={handleChange}
							bind:value={$form.searchQuery} />
						<button
							type="submit"
							class="absolute right-2.5 bottom-2.5 hidden rounded-lg bg-gradient-to-br from-red-600 to-orange-500 px-4 py-1.5 text-sm font-medium text-white shadow transition-all hover:shadow-md focus:outline-none focus:ring-4 focus:ring-orange-300 md:block">
							Search
						</button>
					</div>
					<button
						type="submit"
						class="bottom-2.5 mt-4 w-full rounded-lg bg-gradient-to-br from-red-600 to-orange-500 px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-red-500 md:hidden md:py-2">
						Search
					</button>
				</form>
			</div>
		</div>
		<section class="page flex flex-col items-center px-8 py-32 md:py-20">
			<h3 class="mb-8 text-2xl font-bold text-orange-600">Most Popular Items</h3>
			<div
				class="grid grid-cols-2 gap-4 transition-all sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#if products}
					{#each products as product}
						<ProductCard {product} />
					{/each}
				{/if}
			</div>
			<a href="/product" class="btn-primary text-md mt-8 px-8 py-4">Browse More Products</a>
		</section>
		<section class="page flex flex-col items-center px-8 py-32 md:flex-row">
			<div class="mb-8 flex flex-1 items-center justify-center md:mb-0">
				<img
					src="/images/stall.svg"
					class="h-60"
					height="240"
					width="240"
					alt="people sitting and eating" />
			</div>
			<div class="flex flex-1 flex-col">
				<h3 class="text-3xl font-semibold">Have a stall in the campus?</h3>
				<p class="mt-1 mb-4 text-gray-600 ">
					Grow your business with ease using
					<span
						class="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text font-medium text-transparent">
						Kantina.
					</span>
				</p>
				{#if user === null}
					<a
						href="/register?type=merchant"
						class="inline-flex max-w-md items-center justify-center rounded-lg bg-gray-100 p-5 text-base font-medium text-gray-500 transition-all hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-500 hover:text-white hover:shadow-lg">
						<span class="w-full">Register for a Merchant Account</span>
						<Icon src={ArrowRight} class="ml-3 h-6 w-6" />
					</a>
				{:else}
					<a
						href="/account#upgrade-to-merchant"
						class="inline-flex max-w-md items-center justify-center rounded-lg bg-gray-100 p-5 text-base font-medium text-gray-500 transition-all hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-500 hover:text-white hover:shadow-lg">
						<span class="w-full">Upgrade Your Account</span>
						<Icon src={ArrowRight} class="ml-3 h-6 w-6" />
					</a>
				{/if}
			</div>
		</section>
	</div>
</main>
<Footer />

<svelte:head>
	<title>Kantina</title>
</svelte:head>
