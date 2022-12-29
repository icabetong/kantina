<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { Check, ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'
	import { colors, getColor500 } from '$shared/color'
	import UserStore from '$stores/auth'
	import type { PageData } from './$types'

	export let data: PageData
	$: {
		const { store: userStore } = data
		if (userStore) store = userStore
	}

	let userId = $UserStore?.id
	let isWorking = false
	let error: string | null = null
	let store: Store | null = data.store ? data.store : null

	const { form, handleSubmit } = createForm({
		initialValues: {
			name: store?.name,
			color: store?.color ?? 'yellow'
		},
		onSubmit: async (data) => {
			if (!userId) return
			if (!store?.id) return

			isWorking = true
			try {
				await pocketbase.collection('stores').update(store.id, data)
				goto($page.url, { replaceState: true, invalidateAll: true })
			} catch (ignored) {
				error = 'An error occured while making changes'
			} finally {
				isWorking = false
			}
		}
	})
</script>

<div class="max-w-screen-xl p-8 w-full min-h-screen flex flex-col items-center justify-center">
	<h2 class="page-header self-start">Dashboard</h2>
	<div class="w-full flex items-center" />
	<div class="flex-1 mt-6 w-full grid grid-cols-2 xl:grid-cols-3">
		<form
			class="h-fit border border-gray-200 rounded-lg p-4"
			on:submit|preventDefault={handleSubmit}>
			<h6 class="font-semibold text-lg mb-4">Store Properties</h6>
			<div class="form-control-group ">
				<label for="name" class="form-control-label">Store Name</label>
				<input
					required
					type="text"
					id="name"
					class="form-control-input"
					aria-required="true"
					bind:value={$form.name} />
			</div>
			<div class="form-control-group">
				<h6 class="form-control-label">Color</h6>
				<div class="flex flex-wrap items-start gap-2">
					{#each colors as color}
						<label class={`inline-flex items-center rounded-lg w-8 h-8 ${getColor500(color)}`}>
							<input
								type="radio"
								id={color}
								value={color}
								class="sr-only peer"
								bind:group={$form.color} />
							<span class="cursor-pointer hidden peer-checked:inline-block peer-checked:p-1.5">
								<Icon src={Check} class="w-full h-full text-white" />
							</span>
						</label>
					{/each}
				</div>
			</div>
			{#if error}
				<div class="alert-error">
					<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
					<span class="font-medium">{error}</span>
				</div>
			{/if}
			<Button type="submit" isLoading={isWorking} loadingText="Saving">Save</Button>
		</form>
	</div>
</div>

<svelte:head>
	<title>Merchant Center</title>
</svelte:head>
