<script lang="ts">
	import CheckoutList from '$components/checkout-list/CheckoutList.svelte'
	import { groupBy } from '$shared/group-by'
	import type { PageData } from './$types'

	let cart: CartItem[]
	let stores: Store[]
	let grouped: Map<string, CartItem[]>

	export let data: PageData
	$: {
		cart = data.cart
		stores = data.stores
		grouped = groupBy(cart, (cartItem) => cartItem.expand!.product.store)
	}
</script>

<div class="page min-h-screen">
	<h1 class="page-header">Checkout</h1>
	<div class="h-full mt-8">
		{#each [...grouped] as [key, value]}
			<CheckoutList store={stores.find((store) => store.id === key) ?? null} basket={value} />
		{/each}
	</div>
</div>

<svelte:head>
	<title>Checkout</title>
</svelte:head>
