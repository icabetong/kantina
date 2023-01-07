<script lang="ts">
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	let user: User | null = data.user
</script>

<header class="z-10">
	<Navigation cartItems={data.cart.length} {user} />
</header>
<main class="flex-1 bg-white"><slot /></main>

<Footer />
