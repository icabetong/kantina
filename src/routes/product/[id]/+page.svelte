<script lang="ts">
	import { page } from '$app/stores'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ShoppingCart, CreditCard } from '@steeze-ui/heroicons'
	import { createForm } from 'svelte-forms-lib'

	const { form, handleSubmit, handleChange } = createForm({
		initialValues: {
			quantity: 0
		},
		onSubmit: (data) => {}
	})

	const productId = $page.params.id
	const product = {
		id: '0',
		name: 'Chicken',
		category: 'food',
		price: 100,
		currentPrice: 20,
		quantity: 0,
		created: Date.now(),
		updated: Date.now(),
		visible: false
	}
</script>

<div class="page min-h-screen py-16">
	<form class="flex flex-col items-start gap-8 md:flex-row" on:submit|preventDefault={handleSubmit}>
		<div class="flex-1 w-full">
			<img src="/images/not-found.svg" alt="product" class="object-contain" />
		</div>
		<div class="flex-1 w-full">
			<h3 class="text-3xl text-orange-500 font-bold">{product.name}</h3>
			<p class="text-sm text-gray-500">Product ID: {productId}</p>
			<div class="mt-2 mb-8 text-lg md:text-xl">
				{#if product.currentPrice}
					<span class="text-gray-500 line-through">₱{product.price}</span>
					<span class="text-orange-500 font-medium">₱{product.currentPrice}</span>
				{:else}
					<span class="text-gray-700">₱{product.price}</span>
				{/if}
			</div>
			<div class="form-control-group md:flex md:flex-row md:items-center md:gap-2">
				<label for="quantity" class="form-control-label md:mb-0">Quantity:</label>
				<input
					required
					type="number"
					id="quantity"
					class="form-control-input md:w-64"
					aria-required="true"
					on:change={handleChange}
					bind:value={$form.quantity} />
			</div>
			<div
				class="w-full flex flex-row items-center justify-center mt-4 gap-4 text-lg md:justify-start">
				<button class="btn-primary flex flex-row items-center py-4">
					<Icon src={ShoppingCart} class="h-6 w-6" />
					<span class="ml-2">Add to Cart</span>
				</button>
				<button class="btn-outlined flex flex-row items-center py-4">
					<Icon src={CreditCard} class="h-6 w-6" />
					<span class="ml-2">Order Now</span>
				</button>
			</div>
		</div>
	</form>
</div>

<svelte:head>
	<title>{product.name} - Kantina</title>
</svelte:head>
