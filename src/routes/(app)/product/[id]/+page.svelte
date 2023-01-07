<script lang="ts">
	import moment from 'moment'
	import { onMount } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { ShoppingCart, Star } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import ConfirmModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import FeedbackEditor from '$components/modals/feedback-editor/FeedbackEditor.svelte'
	import NumberStepper from '$components/number-stepper/NumberStepper.svelte'
	import ProductCard from '$components/product-card/ProductCard.svelte'
	import pocketbase from '$lib/backend'
	import { parseFileUrl } from '$lib/files'
	import { getCurrencyFormatter } from '$shared/formatter'
	import UserStore from '$stores/user'
	import type { PageData } from './$types'

	export let data: PageData

	const formatter = getCurrencyFormatter()
	const user = $UserStore
	const productId = $page.params.id
	const { product, related } = data
	const outOfStock = product.quantity < 1

	let ratings: Rating[]
	let averageRating: number = 0

	$: {
		ratings = data.ratings
	}

	let basket: CartItem[] = data.cart

	let quantity: number = 1
	const decrement = () => quantity - 1 > 0 && quantity--
	const increment = () => quantity + 1 <= product.quantity && quantity++

	onMount(() => {
		if (ratings.length > 0) {
			const combined = ratings.reduce((accumulator, feedback) => {
				return accumulator + feedback.rating
			}, 0)
			averageRating = combined / ratings.length
		}
	})

	const onAddToCart = async () => {
		try {
			if (!user) {
				openModal(ConfirmModal, {
					title: 'Create an Account First',
					message: `To add some products into your cart, you need to login or register an account first. 
						Would you like to create one now?`,
					confirmText: 'Continue',
					abandonText: 'Cancel',
					confirm: () => goto('/register')
				})
				return
			}

			const cartItem = basket.find((i) => i.product === product.id)
			if (cartItem) {
				await fetch(`/api/cart/${cartItem.id}`, {
					method: 'PATCH',
					body: JSON.stringify({
						item: { ...cartItem, quantity: cartItem.quantity + quantity }
					})
				})
			} else {
				await fetch('/api/cart', {
					method: 'POST',
					body: JSON.stringify({
						item: { user: user?.id, product: product.id, quantity }
					})
				})
			}

			toast.push('Product added to cart')
			goto($page.url, { replaceState: true, invalidateAll: true })
		} catch (ignored) {}
	}

	const onFeedback = () => openModal(FeedbackEditor, { product })
</script>

<div class="page min-h-screen py-16">
	<section id="info" class="flex flex-col justify-center items-center gap-8 md:flex-row">
		<div
			class="flex-1 w-full h-full flex items-center justify-center border border-gray-100 rounded-lg">
			{#if product.image}
				<img
					src={parseFileUrl('products', product.id, product.image)}
					alt={product.name}
					class="object-contain w-80 h-80" />
			{:else}
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src="/images/meal.svg" alt="placeholder image" class="object-contain px-8 py-14" />
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
			{#if ratings.length}
				<div class="my-2 flex items-center">
					<Icon src={Star} class="w-5 h-5 text-yellow-400" theme="solid" />
					<p class="ml-1.5 text-sm font-bold text-gray-800 ">{averageRating}</p>
					<span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full" />
					<a href="#ratings" class="font-medium text-gray-700 underline hover:no-underline">
						{ratings.length}
						{#if ratings.length === 1}
							review
						{:else}
							reviews
						{/if}
					</a>
				</div>
			{:else}
				<div class="my-2 text-sm text-gray-600">No Ratings Available</div>
			{/if}
			<div class="mt-2 mb-8 text-lg md:text-xl">
				{#if product.currentPrice}
					<span class="text-gray-500 line-through">{formatter.format(product.price)}</span>
					<span class="text-orange-500 font-semibold"
						>{formatter.format(product.currentPrice)}</span>
				{:else}
					<span class="text-gray-700 font-medium">{formatter.format(product.price)}</span>
				{/if}
			</div>
			{#if product.quantity > 0}
				<span class="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded">
					{product.quantity} Available
				</span>
			{:else}
				<span class="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
					Out of Stock
				</span>
			{/if}
			<div class="mt-4 md:flex md:flex-row md:items-center md:gap-2">
				<label for="quantity" class="form-control-label md:mb-0" aria-disabled={outOfStock}>
					Quantity:
				</label>
				<NumberStepper
					value={quantity}
					max={product.quantity}
					min={1}
					disabled={product.quantity < 1}
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
			</div>
		</div>
	</section>
	{#if ratings.some((r) => r.user !== user?.id) || ratings.length < 1}
		<section
			id="feedback"
			class="mt-16 px-4 py-6 flex flex-col items-center justify-between gap-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl md:flex-row md:gap-0">
			<div class="flex-initial md:w-2/3">
				<h6 class="text-orange-500 font-medium">
					Have an opinion with this product? You can rate it.
				</h6>
				<p class="mt-2 text-sm text-orange-400">
					Rating and feedback help other users determine the quality of the product, it helps us
					curate suggested products too.
				</p>
			</div>
			<button type="button" class="btn-primary" on:click={onFeedback}>Submit Feedback</button>
		</section>
	{/if}
	<section id="ratings" class="mt-8">
		<h5 class="text-orange-500 text-lg font-semibold mb-4">Ratings and Feedback</h5>
		{#if ratings.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				{#each ratings as rating}
					{#if rating.expand?.user && rating.expand?.user.avatar}
						<div class="border border-gray-200 rounded-lg p-4">
							<div class="flex items-center mb-4 space-x-4">
								<img
									src={parseFileUrl('users', rating.expand.user.id, rating.expand.user.avatar)}
									alt={`${rating.expand.user.firstName} ${rating.expand.user.lastName}'s avatar'`}
									class="w-10 h-10 rounded-full" />
								<div class="space-y-1 font-medium">
									<p>
										{rating.expand.user.firstName}
										{rating.expand.user.lastName}
										<time class="block text-sm text-gray-500" datetime={rating.updated}>
											{moment(Date.parse(rating.created)).fromNow()}
										</time>
									</p>
								</div>
							</div>
							<div class="flex items-center mb-1">
								{#each [1, 2, 3, 4, 5] as star}
									<Icon
										src={Star}
										class={`w-5 h-5 ${star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
										theme="solid" />
								{/each}
								<h3 class="ml-2 text-sm font-semibold text-gray-800 ">
									{rating.title}
								</h3>
							</div>
							<p class="mb-2 font-light text-gray-500">{rating.description}</p>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div
				class="flex flex-col items-center px-4 py-6 bg-gray-50 border border-gray-100 rounded-lg">
				<h5 class="text-xl text-orange-500 font-semibold">No Ratings Yet</h5>
				<p class="max-w-lg text-gray-500 text-center text-sm">
					There are no submitted feedback to this product. Be the first one to rate.
				</p>
			</div>
		{/if}
	</section>
	{#if related.length > 0}
		<section id="related" class="mt-8">
			<h5 class="text-orange-500 text-lg font-semibold mb-4">Related Products</h5>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{#each related as product}
					<ProductCard {product} />
				{/each}
			</div>
		</section>
	{/if}
</div>

<svelte:head>
	<title>{product.name} - Kantina</title>
</svelte:head>
