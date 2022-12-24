<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'
	import { XMark } from '@steeze-ui/heroicons'
	import { closeModal } from 'svelte-modals'

	export let isOpen: boolean
	export let title: string
	export let asForm: boolean = false
	export let onSubmit: (event: Event) => void = () => {}
</script>

{#if isOpen}
	<div
		id="modal"
		role="dialog"
		class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full">
		<div class="relative w-full h-full max-w-2xl md:h-auto">
			{#if asForm}
				<form on:submit|preventDefault={onSubmit} class="relative bg-white rounded-lg shadow">
					<div class="flex items-start justify-between p-4 border-b rounded-t">
						<h3 class="text-xl font-semibold text-gray-800">{title}</h3>
						<button
							type="button"
							class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="defaultModal"
							on:click={closeModal}>
							<Icon src={XMark} class="w-5 h-5" />
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<div class="p-6 space-y-6">
						<slot />
					</div>
					<div
						class="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
						<slot name="actions" />
					</div>
				</form>
			{:else}
				<div class="relative bg-white rounded-lg shadow">
					<div class="flex items-start justify-between p-4 border-b rounded-t">
						<h3 class="text-xl font-semibold text-gray-800">{title}</h3>
						<button
							type="button"
							class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
							data-modal-toggle="defaultModal"
							on:click={closeModal}>
							<Icon src={XMark} class="w-5 h-5" />
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<div class="p-6 space-y-6">
						<slot />
					</div>
					<div
						class="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
						<slot name="actions" />
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
