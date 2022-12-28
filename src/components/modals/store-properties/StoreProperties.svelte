<script lang="ts">
	import Modal from '$components/modals/Modal.svelte'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'
	import UserStore from '$stores/auth'
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ExclamationTriangle, Check } from '@steeze-ui/heroicons'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { colors, getColor500 } from '$shared/color'

	export let isOpen: boolean
	export let store: Store
	let userId = $UserStore?.id
	let isWorking = false
	let error: string | null = null

	const { form, handleSubmit } = createForm({
		initialValues: {
			name: store.name,
			color: store.color ?? 'yellow'
		},
		onSubmit: async (data) => {
			if (!userId) return

			isWorking = true
			try {
				await pocketbase.collection('stores').update(store.id, data)
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

<Modal {isOpen} title="Store Properties" size="sm" asForm on:submit={handleSubmit}>
	<div>
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
			<div class="flex items-start gap-2">
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
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<Button type="submit" isLoading={isWorking} loadingText="Saving">Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
