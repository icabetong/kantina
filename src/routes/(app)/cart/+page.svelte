<script lang="ts">
	import { CreditCard } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import CartTable from '$components/cart-table/CartTable.svelte'
	import EmptyView from '$components/empty-state/EmptyState.svelte'
	import pocketbase from '$lib/backend'
	import type { PageData } from './$types'

	export let data: PageData
	let cart: CartItem[]
	$: {
		const { cartItems } = data
		cart = cartItems
	}

	const onTriggerRemove = async (event: CustomEvent) => {
		try {
			const cartItem = event.detail

			await pocketbase.collection('carts').delete(cartItem.id)
			toast.push('Product removed from cart')
			goto($page.url, { replaceState: true, invalidateAll: true })
		} catch (ignored) {}
	}

	const onCheckout = async () => {
		const products = cart.map((c) => c.product)
		console.log(products)

		const order = {
			customer: pocketbase.authStore?.model?.id,
			status: 'pending',
			store: cart.map((c) => c.expand?.product.store),
			products: products,
			reference: ''
		}
		console.log(order)

		await pocketbase.collection('orders').create(order)
	}
</script>

<div class="page min-h-screen">
	<div class="w-full flex items-center justify-between">
		<h2 class="page-header text-start mb-0">Your Cart</h2>
		{#if cart.length > 0}
			<button
				on:click={onCheckout}
				class="btn-primary shadow inline-flex items-center transition-all">
				<Icon src={CreditCard} class="w-5 h-5 md:mr-2 -ml-1" />
				<span class="hidden md:inline-block">Proceed to Checkout</span>
			</button>
		{/if}
	</div>
	{#if cart.length > 0}
		<div class="pt-6 pb-32">
			<CartTable cartItems={cart} on:remove={onTriggerRemove} />
		</div>
	{:else}
		<EmptyView
			icon="/images/empty-cart.svg"
			title="Your Cart is Empty"
			message="Looks like you have not added anything to your cart. Go ahead & explore some items." />
	{/if}
</div>

<svelte:head>
	<title>Cart - Kantina</title>
</svelte:head>
