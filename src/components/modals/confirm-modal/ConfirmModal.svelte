<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import Modal from '$components/modals/Modal.svelte'

	export let isOpen: boolean
	export let title: string
	export let message: string
	export let confirmText: string
	export let abandonText: string
	export let confirm: () => void
	export let abandon = () => closeModal()

	const onHandleConfirm = () => {
		confirm()
		closeModal()
	}
</script>

<Modal {isOpen} {title} size="sm">
	<div>
		{message}
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<button type="button" class="btn-primary" on:click={onHandleConfirm}>{confirmText}</button>
		<button type="button" class="btn-outlined" on:click={abandon}>
			{abandonText}
		</button>
	</div>
</Modal>
