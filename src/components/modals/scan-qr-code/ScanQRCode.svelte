<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import Modal from '$components/modals/Modal.svelte'
	import { parseFileUrl } from '$lib/files'

	export let isOpen: boolean
	export let store: Store | null = null
	export let onDone: () => void

	const handleDone = () => {
		onDone()
		closeModal()
	}
</script>

<Modal {isOpen} title="Scan to Pay" size="sm">
	<div class="flex flex-col items-center justify-center">
		{#if store && store.image && typeof store.image === 'string'}
			<img
				src={parseFileUrl('stores', store.id, store.image)}
				alt="qr-code"
				class="h-60 rounded-lg mb-4" />
		{/if}
		<h5 class="text-gray-500">Scan the QR Code above to pay for your order</h5>
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<button type="button" class="btn-primary" on:click={handleDone}>Place Order</button>
		<button type="button" class="btn-outlined" on:click={closeModal}> Cancel </button>
	</div>
</Modal>
