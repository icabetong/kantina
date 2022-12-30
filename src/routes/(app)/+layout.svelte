<script lang="ts">
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import type { LayoutData } from './$types'

	let cart = 0
	export let data: LayoutData
	$: {
		cart = data.cart.length
	}
</script>

<header class="z-10">
	<Navigation cartItems={0} />
</header>
<main class="flex-1 bg-white"><slot /></main>

<Footer />
