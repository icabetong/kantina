<script lang="ts">
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
	let cart = 0
	let user: User | null = data.user

	$: {
		cart = data.cart.length
	}
</script>

<header class="z-10">
	<Navigation cartItems={0} {user} />
</header>
<main class="flex-1 bg-white"><slot /></main>

<Footer />
