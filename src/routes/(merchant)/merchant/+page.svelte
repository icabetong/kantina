<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { openModal } from 'svelte-modals'
	import { Check, ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import SetQrCode from '$components/modals/update-qr-code/UpdateQRCode.svelte'
	import { parseFileUrl } from '$lib/files'
	import { colors, getColor500 } from '$shared/color'
	import UserStore from '$stores/user'
	import type { PageData } from './$types'

	const user = $UserStore
	export let data: PageData
	$: {
		const { store: userStore } = data
		if (userStore) store = userStore
	}

	let error: string | null = null
	let store: Store | null = data.store ? data.store : null

	const { form, handleSubmit, isModified, isSubmitting } = createForm({
		initialValues: {
			name: store?.name,
			color: store?.color ?? 'yellow'
		},
		onSubmit: async (data) => {
			if (!user?.id) return
			if (!store?.id) return

			try {
				await fetch(`/api/store/${store.id}`, {
					method: 'PATCH',
					body: JSON.stringify({ store: data })
				})
				goto($page.url, { replaceState: true, invalidateAll: true })
			} catch (ignored) {
				error = 'An error occured while making changes'
			}
		}
	})

	const onTriggerQRCode = () => openModal(SetQrCode, { store })
</script>

<div class="flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center p-8">
	<h2 class="page-header self-start">Dashboard</h2>
	<div class="flex w-full items-center" />
	<div class="mt-6 grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
		<form
			class="h-fit rounded-lg border border-gray-200 p-4"
			on:submit|preventDefault={handleSubmit}>
			<h6 class="mb-6 text-lg font-semibold">Store Properties</h6>

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
						<label class={`inline-flex h-8 w-8 items-center rounded-lg ${getColor500(color)}`}>
							<input
								type="radio"
								id={color}
								value={color}
								class="peer sr-only"
								bind:group={$form.color} />
							<span class="hidden cursor-pointer peer-checked:inline-block peer-checked:p-1.5">
								<Icon src={Check} class="h-full w-full text-white" />
							</span>
						</label>
					{/each}
				</div>
			</div>
			{#if error}
				<div class="alert-error">
					<Icon src={ExclamationTriangle} class="mr-3 inline h-5 w-5 flex-shrink-0" />
					<span class="font-medium">{error}</span>
				</div>
			{/if}
			{#if $isModified}
				<div class="flex justify-end">
					<Button type="submit" isLoading={$isSubmitting} loadingText="Saving">Save</Button>
				</div>
			{/if}
		</form>
		<div class="h-fit rounded-lg border border-gray-200 p-4">
			<h6 class="mb-4 text-lg font-semibold">Payment Method</h6>
			{#if store && store.image}
				<div class="flex flex-col items-center justify-center">
					<img src={parseFileUrl('stores', store.id, store.image)} alt="qr-code" class="h-60" />
					<button class="btn-outlined" on:click={onTriggerQRCode}>Update QR Code</button>
				</div>
			{:else}
				<div
					id="no-qr"
					class="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4"
					role="alert">
					<div class="flex items-center">
						<Icon
							src={ExclamationTriangle}
							class="mr-2 inline h-5 w-5 flex-shrink-0 text-yellow-700" />
						<span class="sr-only">Info</span>
						<h3 class="text-lg font-medium text-yellow-700">Undefined payment method</h3>
					</div>
					<div class="mt-2 mb-4 text-sm text-yellow-700">
						You currently do not have any means of payment setup for the customer. Please upload
						your QRPh code immediately.
					</div>
					<div class="flex">
						<button
							type="button"
							class="mr-2 inline-flex items-center rounded-lg bg-yellow-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300"
							on:click={onTriggerQRCode}>
							Upload
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	<title>Merchant Center</title>
</svelte:head>
