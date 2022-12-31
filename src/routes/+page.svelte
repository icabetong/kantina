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
	<div class="text-gray-800 bg-white min-h-screen">
		<div class="hero border-b">
			<div class="page flex flex-col py-12 items-start md:items-center justify-start md:py-56">
				<h1 class="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
					Discover new stalls and{' '}
					<span class="text-transparent bg-clip-text bg-gradient-to-br to-pink-500 from-orange-500">
						food
					</span>
				</h1>
				<p class="text-md font-normal text-gray-500 lg:text-lg">
					Good food and drinks that are delicious that are affordable and with various choices.
				</p>
				<form class="mt-16 w-full md:w-3/4" on:submit|preventDefault={handleSubmit}>
					<label for="searchQuery" class="mb-2 text-sm font-medium text-gray-800 sr-only">
						Search
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
						</div>
						<input
							type="search"
							id="searchQuery"
							class="block w-full p-4 pl-10 text-sm text-gray-800 outline outline-gray-300 rounded-lg bg-gray-50 transition-all focus:ring-orange-500 focus:outline-2 focus:outline-orange-500"
							placeholder="Search for food, drinks, menus or stalls..."
							required
							on:change={handleChange}
							bind:value={$form.searchQuery} />
						<button
							type="submit"
							class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-br to-pink-500 from-orange-400 hidden font-medium rounded-lg text-sm px-4 py-1.5 shadow transition-all hover:shadow-md focus:ring-4 focus:outline-none focus:ring-orange-300 md:block">
							Search
						</button>
					</div>
					<button
						type="submit"
						class="text-white bottom-2.5 bg-gradient-to-br to-pink-500 from-orange-400 font-medium rounded-lg text-sm px-4 py-3.5 md:py-2 w-full mt-4 focus:ring-4 focus:outline-none focus:ring-orange-300 md:hidden">
						Search
					</button>
				</form>
			</div>
		</div>
		<section class="page flex flex-col items-center px-8 py-32 md:py-20">
			<h3 class="text-orange-600 text-2xl font-bold mb-8">Most Popular Items</h3>
			<div
				class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all">
				{#if products}
					{#each products as product}
						<ProductCard {product} />
					{/each}
				{/if}
			</div>
			<a href="/product" class="mt-8 btn-primary px-8 py-4 text-md">Browse More Products</a>
		</section>
		<section class="page flex flex-col md:flex-row items-center px-8 py-32">
			<div class="flex-1 flex items-center justify-center mb-8 md:mb-0">
				<img
					src="/images/stall.svg"
					class="h-60"
					height="240"
					width="240"
					alt="people sitting and eating" />
			</div>
			<div class="flex-1 flex flex-col">
				<h3 class="font-semibold text-3xl">Have a stall in the campus?</h3>
				<p class="mt-1 mb-4 text-gray-600 ">
					Grow your business with ease using
					<span
						class="font-medium text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">
						Kantina.
					</span>
				</p>
				{#if user === null}
					<a
						href="/register?type=merchant"
						class="inline-flex max-w-md justify-center items-center p-5 text-base font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 hover:text-white hover:shadow-lg transition-all">
						<span class="w-full">Register for a Merchant Account</span>
						<Icon src={ArrowRight} class="ml-3 w-6 h-6" />
					</a>
				{:else}
					<a
						href="/account#upgrade-to-merchant"
						class="inline-flex max-w-md justify-center items-center p-5 text-base font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 hover:text-white hover:shadow-lg transition-all">
						<span class="w-full">Upgrade Your Account</span>
						<Icon src={ArrowRight} class="ml-3 w-6 h-6" />
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
