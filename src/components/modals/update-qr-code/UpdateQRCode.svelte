<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import Modal from '$components/modals/Modal.svelte'
	import pocketbase from '$lib/backend'

	export let isOpen: boolean
	export let store: Store | null = null

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
	const onUpdateQRCode = async () => {
		if (!fileInput.files) return
		if (!store) return

		isWorking = true
		try {
			const formData = new FormData()
			formData.append('image', fileInput.files[0])
			await pocketbase.collection('stores').update(store?.id, formData)

			goto($page.url, { replaceState: true, invalidateAll: true })
			closeModal()
		} catch (ignored) {
		} finally {
			isWorking = false
		}
	}
</script>

<Modal {isOpen} title="Configure QRPh Code" size="sm">
	<div class="flex flex-col items-center justify-center">
		{#if avatar && typeof avatar === 'string'}
			<img src={avatar} alt="avatar" class="h-60 rounded-lg mb-8" />
		{/if}
		<div class="form-control-group ">
			<label for="qr-code" class="sr-only">Browse Image</label>
			<input
				type="file"
				id="qr-code"
				class="form-control-file"
				on:change={onFileSelected}
				bind:this={fileInput} />
		</div>
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<Button type="button" isLoading={isWorking} on:click={onUpdateQRCode}>Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}> Cancel </button>
	</div>
</Modal>
