<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import PageProgress from '$components/page-progress/PageProgress.svelte'
	import pocketbase from '$lib/backend'
	import '../app.css'
	import type { PageData } from './$types'

	export let data: PageData

	if (
		($page.url.pathname === '/login' || $page.url.pathname === '/register') &&
		pocketbase.authStore.isValid
	) {
		goto('/')
	}
</script>

<PageProgress />
<slot />

<SvelteToast />
<Modals>
	<div
		slot="backdrop"
		class="fixed top-0 bottom-0 left-0 right-0 z-20 bg-black bg-opacity-50 transition-all"
		on:click={closeModal}
		on:keydown={null} />
</Modals>
