<script lang="ts">
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import type { PageData } from './$types'

	let cart = 0
	export let data: PageData
	$: {
		cart = data.cartItems.length
	}
</script>

<header class="z-10">
	<Navigation cartItems={0} />
</header>
<main class="flex-1 bg-white"><slot /></main>

<Footer />
