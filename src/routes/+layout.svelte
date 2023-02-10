<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals'
	import type { ActionResult } from '@sveltejs/kit'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { applyAction, enhance } from '$app/forms'
	import PageProgress from '$components/page-progress/PageProgress.svelte'
	import pocketbase from '$lib/backend'
	import UserStore from '$stores/user'
	import '../app.css'

	const onEndSession = () => {
		return async ({ result }: { result: ActionResult }) => {
			pocketbase.authStore.clear()
			await applyAction(result)
		}
	}
</script>

<PageProgress />
{#if $UserStore?.status === 'banned' || $UserStore?.status === 'suspended'}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<div class="p-4 md:max-w-screen-sm">
			<div class="mb-12 flex items-center justify-center">
				<img src="/images/icon.png" class="mr-2 h-12" height="48" width="48" alt="kantina logo" />
				<span class="self-center whitespace-nowrap text-3xl font-semibold text-red-600">
					Kantina</span>
			</div>
			<h6 class="mb-2 text-xl font-semibold md:text-2xl">Permissions denied</h6>
			{#if $UserStore?.status === 'banned'}
				<p class="mb-8 text-gray-500">
					You are not allowed to access this page, as you have violated some policies and the
					administrators have resulted in banning your account.
				</p>
			{:else if $UserStore?.status === 'suspended'}
				<p class="mb-8 text-gray-500">
					You are not allowed to access this page, as you have violated some policies and the
					administrators have resulted in suspension of your account.
				</p>
			{/if}
			<form method="POST" action="/logout" use:enhance={onEndSession}>
				<button class="btn-primary"> Sign Out </button>
			</form>
		</div>
	</div>
{:else}
	<slot />
{/if}

<SvelteToast />
<Modals>
	<div
		slot="backdrop"
		class="fixed top-0 bottom-0 left-0 right-0 z-20 bg-black bg-opacity-50 transition-all"
		on:click={closeModal}
		on:keydown={null} />
</Modals>

<svelte:head>
	<title>Kantina</title>
</svelte:head>
