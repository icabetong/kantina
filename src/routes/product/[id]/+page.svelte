<script lang="ts">
	import { page } from '$app/stores'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ShoppingCart, CreditCard } from '@steeze-ui/heroicons'
	import UserStore from '$stores/auth'
	import type { PageData } from './$types'
	import { parseFileUrl } from '$lib/files'
	import NumberStepper from '$components/number-stepper/NumberStepper.svelte'
	import pocketbase from '$lib/backend'
	import { goto } from '$app/navigation'

	export let data: PageData

	const user = $UserStore
	const productId = $page.params.id
	const { product, cartItems } = data
	const outOfStock = product.quantity < 1

	let quantity: number = 1
	const decrement = () => quantity - 1 > 0 && quantity--
	const increment = () => quantity + 1 <= product.quantity && quantity++

	const onAddToCart = async () => {
		try {
			if (!user) throw new Error('Authentication Error')

			const cartItem = cartItems.find((i) => i.product === product.id)
			if (cartItem) {
				const data = {
					...cartItem,
					quantity: cartItem.quantity + quantity
				}

				await pocketbase.collection('carts').update(cartItem.id, data)
			} else {
				const cartItem = {
					user: user?.id,
					product: product.id,
					quantity
				}

				await pocketbase.collection('carts').create(cartItem)
			}

			goto($page.url, { replaceState: true, invalidateAll: true })
		} catch (ignored) {}
	}
</script>

<div class="page min-h-screen py-16">
	<section id="info" class="flex flex-col items-start gap-8 md:flex-row">
		<div class="flex-1 w-full">
			{#if product.image}
				<img
					src={parseFileUrl('products', product.id, product.image)}
					alt={product.name}
					class="object-contain" />
			{:else}
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src="/images/meal.svg" alt="placeholder image" class="object-contain" />
			{/if}
		</div>
		<div class="flex-1 w-full">
			{#if product.expand?.store.name}
				<span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
					{product.expand.store.name}
				</span>
			{/if}
			<h3 class="mt-3 text-3xl text-orange-500 font-bold">{product.name}</h3>
			<p class="text-sm text-gray-500">Product ID: {productId}</p>
			<div class="mt-2 mb-8 text-lg md:text-xl">
				{#if product.currentPrice}
					<span class="text-gray-500 line-through">₱{product.price}</span>
					<span class="text-orange-500 font-semibold">₱{product.currentPrice}</span>
				{:else}
					<span class="text-gray-700 font-medium">₱{product.price}</span>
				{/if}
			</div>
			<span class="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded">
				{product.quantity} Available
			</span>
			<div class="mt-4 md:flex md:flex-row md:items-center md:gap-2">
				<label for="quantity" class="form-control-label md:mb-0" aria-disabled={outOfStock}>
					Quantity:
				</label>
				<NumberStepper
					value={quantity}
					max={product.quantity}
					min={1}
					on:increment={increment}
					on:decrement={decrement} />
			</div>
			<div
				class="w-full flex flex-row items-center justify-center mt-4 gap-4 text-lg md:justify-start">
				<button
					class="btn-primary flex flex-row items-center py-4"
					disabled={outOfStock}
					aria-disabled={outOfStock}
					on:click={onAddToCart}>
					<Icon src={ShoppingCart} class="h-6 w-6" />
					<span class="ml-2">Add to Cart</span>
				</button>
				<button
					class="btn-outlined flex flex-row items-center py-4"
					disabled={outOfStock}
					aria-disabled={outOfStock}>
					<Icon src={CreditCard} class="h-6 w-6" />
					<span class="ml-2">Order Now</span>
				</button>
			</div>
		</div>
	</section>
	<div
		class="mt-16 px-4 py-6 flex flex-col items-center justify-between gap-4 bg-orange-100 rounded-xl md:flex-row md:gap-0">
		<div class="flex-initial md:w-2/3">
			<h6 class="text-orange-500 font-medium">
				Have an opinion with this product? You can rate it.
			</h6>
			<p class="mt-2 text-sm text-orange-400">
				Rating and feedback help other users determine the quality of the product, it helps us
				curate suggested products too.
			</p>
		</div>
		<button class="btn-primary">Submit Feedback</button>
	</div>
</div>

<svelte:head>
	<title>{product.name} - Kantina</title>
</svelte:head>
