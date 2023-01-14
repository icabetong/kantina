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
	<section id="info" class="flex flex-col items-center justify-center gap-8 md:flex-row">
		<div
			class="flex h-full w-full flex-1 items-center justify-center rounded-lg border border-gray-100">
			{#if product.image}
				<img
					src={parseFileUrl('products', product.id, product.image)}
					alt={product.name}
					class="h-80 w-80 object-contain" />
			{:else}
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src="/images/meal.svg" alt="placeholder image" class="object-contain px-8 py-14" />
			{/if}
		</div>
		<div class="w-full flex-1">
			{#if product.expand?.store.name}
				<span class="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
					{product.expand.store.name}
				</span>
			{/if}
			<h3 class="mt-3 text-3xl font-bold text-orange-500">{product.name}</h3>
			<p class="text-sm text-gray-500">Product ID: {productId}</p>
			{#if ratings.length}
				<div class="my-2 flex items-center">
					<Icon src={Star} class="h-5 w-5 text-yellow-400" theme="solid" />
					<p class="ml-1.5 text-sm font-bold text-gray-800 ">{averageRating}</p>
					<span class="mx-1.5 h-1 w-1 rounded-full bg-gray-500" />
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
					<span class="font-semibold text-orange-500"
						>{formatter.format(product.currentPrice)}</span>
				{:else}
					<span class="font-medium text-gray-700">{formatter.format(product.price)}</span>
				{/if}
			</div>
			{#if product.quantity > 0}
				<span class="rounded bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800">
					{product.quantity} Available
				</span>
			{:else}
				<span class="rounded bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
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
				class="mt-4 flex w-full flex-row items-center justify-center gap-4 text-lg md:justify-start">
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
			class="mt-16 flex flex-col items-center justify-between gap-4 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 px-4 py-6 md:flex-row md:gap-0">
			<div class="flex-initial md:w-2/3">
				<h6 class="font-medium text-orange-500">
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
		<h5 class="mb-4 text-lg font-semibold text-orange-500">Ratings and Feedback</h5>
		{#if ratings.length > 0}
			<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
				{#each ratings as rating}
					{#if rating.expand?.user && rating.expand?.user.avatar}
						<div class="rounded-lg border border-gray-200 p-4">
							<div class="mb-4 flex items-center space-x-4">
								<img
									src={parseFileUrl('users', rating.expand.user.id, rating.expand.user.avatar)}
									alt={`${rating.expand.user.firstName} ${rating.expand.user.lastName}'s avatar'`}
									class="h-10 w-10 rounded-full" />
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
							<div class="mb-1 flex items-center">
								{#each [1, 2, 3, 4, 5] as star}
									<Icon
										src={Star}
										class={`h-5 w-5 ${star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
				class="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 px-4 py-6">
				<h5 class="text-xl font-semibold text-orange-500">No Ratings Yet</h5>
				<p class="max-w-lg text-center text-sm text-gray-500">
					There are no submitted feedback to this product. Be the first one to rate.
				</p>
			</div>
		{/if}
	</section>
	{#if related.length > 0}
		<section id="related" class="mt-8">
			<h5 class="mb-4 text-lg font-semibold text-orange-500">Related Products</h5>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
