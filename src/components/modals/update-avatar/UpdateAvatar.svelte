<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import Button from '$components/button/Button.svelte'
	import Modal from '$components/modals/Modal.svelte'
	import pocketbase from '$lib/backend'

	export let isOpen: boolean
	export let userId: string | null

	let isWorking: boolean = false
	let avatar: string | ArrayBuffer | null = null
	let fileInput: HTMLInputElement
	const onFileSelected = (event: Event) => {
		if (event && event.target !== null) {
			const target = event.target as HTMLInputElement

			let image = target.files && target.files[0]
			if (!image) return

			let reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (event: ProgressEvent<FileReader>) => {
				avatar = event.target?.result ?? null
			}
		}
	}
	const onUpdateAvatar = async () => {
		if (!fileInput.files) return
		if (!userId) return

		isWorking = true
		try {
			const formData = new FormData()
			formData.append('avatar', fileInput.files[0])
			await pocketbase.collection('users').update(userId, formData)

			closeModal()
		} catch (ignored) {
		} finally {
			isWorking = false
		}
	}
</script>

<Modal {isOpen} title="Update Avatar" size="sm">
	<div class="flex flex-col items-center justify-center">
		{#if avatar && typeof avatar === 'string'}
			<img src={avatar} alt="avatar" class="mb-8 h-36 w-36 rounded-full" />
		{/if}
		<div class="form-control-group ">
			<label for="avatar" class="sr-only">Browse Image</label>
			<input
				type="file"
				id="avatar"
				class="form-control-file"
				on:change={onFileSelected}
				bind:this={fileInput} />
		</div>
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<Button type="button" isLoading={isWorking} on:click={onUpdateAvatar}>Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}> Cancel </button>
	</div>
</Modal>
