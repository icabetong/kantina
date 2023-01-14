<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'
	import { Check, ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import Modal from '$components/modals/Modal.svelte'
	import pocketbase from '$lib/backend'
	import { colors, getColor500 } from '$shared/color'
	import UserStore from '$stores/user'

	const user = $UserStore
	export let isOpen: boolean
	export let store: Store
	let isWorking = false
	let error: string | null = null

	const { form, handleSubmit } = createForm({
		initialValues: {
			name: store.name,
			color: store.color ?? 'yellow'
		},
		onSubmit: async (data) => {
			if (!user?.id) return

			isWorking = true
			try {
				await fetch('/api/stores', {
					method: 'PATCH',
					body: JSON.stringify({ store: data })
				})
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
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<Button type="submit" isLoading={isWorking} loadingText="Saving">Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
