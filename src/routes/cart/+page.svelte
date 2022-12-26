<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast'
	import CartTable from '$components/cart-table/CartTable.svelte'
	import EmptyView from '$components/empty-view/EmptyView.svelte'
	import type { PageData } from './$types'
	import pocketbase from '$lib/backend'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { CreditCard } from '@steeze-ui/heroicons'

	export let data: PageData
	let cart: App.CartItem[]
	$: {
		const { cartItems } = data
		cart = cartItems
	}

	const onTriggerRemove = async (cartItem: App.CartItem) => {
		try {
			await pocketbase.collection('carts').delete(cartItem.id)
			toast.push('Product removed from cart')
			goto($page.url, { replaceState: true, invalidateAll: true })
		} catch (ignored) {}
	}
</script>

<div class="page">
	<div class="w-full flex items-center justify-between">
		<h2 class="page-header text-start mb-0">Your Cart</h2>
		<button class="btn-primary shadow inline-flex items-center transition-all">
			<Icon src={CreditCard} class="w-5 h-5 mr-2 -ml-1" />
			Proceed to Checkout
		</button>
	</div>
	{#if cart.length > 0}
		<div class="pt-6 pb-32">
			<CartTable cartItems={cart} onCartItemClick={onTriggerRemove} />
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
