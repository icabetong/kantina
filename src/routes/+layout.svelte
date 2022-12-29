<script lang="ts">
	import '../app.css'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { closeModal, Modals } from 'svelte-modals'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import Navigation from '$components/navigation/Navigation.svelte'
	import PageProgress from '$components/page-progress/PageProgress.svelte'
	import pocketbase from '$lib/backend'

	import type { PageData } from './$types'

	export let data: PageData
	let cart: CartItem[]
	$: {
		const { cartItems } = data
		cart = cartItems
	}

	if (
		($page.url.pathname === '/login' || $page.url.pathname === '/register') &&
		pocketbase.authStore.isValid
	) {
		goto('/')
	}
</script>

<PageProgress />

<header class="z-10"><Navigation cartItems={cart.length} /></header>
<main class="flex-1 bg-white">
	<slot />
</main>
<footer class="flex-1 p-4 bg-gray-50 md:px-6 md:py-8 border-t border-gray-200">
	<div class="sm:flex sm:items-center sm:justify-between">
		<a href="https://kantina.ph" class="flex flex-row items-center mb-4 sm:mb-0">
			<img src="/images/icon.png" class="mr-3 h-8" alt="Kantina Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap "> Kantina </span>
		</a>
		<ul
			class="flex flex-col flex-wrap items-start mb-6 text-sm text-gray-500 sm:mb-0 sm:flex-row sm:items-center">
			<li>
				<a href="/about" class="mr-4 hover:underline md:mr-6 ">About</a>
			</li>
			<li>
				<a href="/privacy" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
			</li>
			<li>
				<a href="/terms" class="mr-4 hover:underline md:mr-6 ">Terms and Conditions</a>
			</li>
			<li>
				<a href="/contact" class="hover:underline">Contact</a>
			</li>
		</ul>
	</div>
	<hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
	<span class="block text-sm text-gray-500 sm:text-center">
		© 2022
		<a href="https://kantina.ph/" class="hover:underline">Kantina™</a>. All Rights Reserved.
	</span>
</footer>
<SvelteToast />
<Modals>
	<div
		slot="backdrop"
		class="fixed top-0 bottom-0 left-0 right-0 z-20 bg-black bg-opacity-50 transition-all"
		on:click={closeModal}
		on:keydown={null} />
</Modals>
