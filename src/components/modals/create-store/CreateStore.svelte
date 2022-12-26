<script lang="ts">
	import Modal from '$components/modals/Modal.svelte'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'
	import UserStore from '$stores/auth'
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ExclamationTriangle } from '@steeze-ui/heroicons'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	export let isOpen: boolean
	let user = $UserStore
	let userId = user?.id
	let isWorking = false
	let error: string | null = null

	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: ''
		},
		onSubmit: async (data) => {
			if (!userId) return

			isWorking = true
			try {
				const store = {
					owner: userId,
					name: data.name,
					status: 'operating'
				}

				await pocketbase.collection('stores').create(store)
				await pocketbase.collection('users').update(userId, { type: 'merchant' })
				goto($page.url, { replaceState: true, invalidateAll: true })
				closeModal()
			} catch (ignored) {
				error = 'An error occured while making changes'
			} finally {
				isWorking = false
			}
		}
	})
</script>

<Modal {isOpen} title="Create New Store" size="sm" asForm on:submit={handleSubmit}>
	<div>
		<p class="text-gray-500 text-sm mb-4">
			To Upgrade to a Merchant Account, you will need to create a Store. Type in the name you want
			and click "Create".
		</p>
		<div class="form-control-group">
			<label for="name" class="form-control-label">Store Name</label>
			<input
				required
				type="text"
				id="name"
				class="form-control-input"
				aria-required="true"
				placeholder={user && `${user?.firstName}'s Store`}
				on:change={handleChange}
				bind:value={$form.name} />
		</div>
		{#if error}
			<div class="alert-error">
				<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
				<span class="font-medium">{error}</span>
			</div>
		{/if}
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<Button type="submit" isLoading={isWorking} loadingText="Processing">Create</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
