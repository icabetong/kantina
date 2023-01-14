<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { closeModal } from 'svelte-modals'
	import { XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'

	const dispatcher = createEventDispatcher()
	const submit = () => dispatcher('submit')

	export let isOpen: boolean
	export let title: string
	export let asForm: boolean = false
	export let size: 'sm' | 'md' = 'md'
</script>

{#if isOpen}
	<div
		id="modal"
		role="dialog"
		class="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden p-6 md:inset-0 md:h-full">
		<div
			class={`relative w-full ${
				size === 'sm' ? 'md:w-1/2' : 'md:w-full'
			} h-full max-w-2xl md:h-auto`}>
			{#if asForm}
				<form on:submit|preventDefault={submit} class="relative rounded-lg bg-white shadow">
					<div class="flex items-start justify-between rounded-t border-b px-6 py-5">
						<h3 class="text-xl font-semibold text-gray-800">{title}</h3>
						<button
							type="button"
							class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-800"
							data-modal-toggle="defaultModal"
							on:click={closeModal}>
							<Icon src={XMark} class="h-5 w-5" />
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<div class="space-y-6 px-6 py-4">
						<slot />
					</div>
					<div
						class="flex items-center justify-end gap-4 space-x-2 rounded-b border-t border-gray-200 px-6 py-4">
						<slot name="actions" />
					</div>
				</form>
			{:else}
				<div class="relative rounded-lg bg-white shadow">
					<div class="flex items-start justify-between rounded-t border-b px-6 py-5">
						<h3 class="text-xl font-semibold text-gray-800">{title}</h3>
						<button
							type="button"
							class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-800"
							data-modal-toggle="defaultModal"
							on:click={closeModal}>
							<Icon src={XMark} class="h-5 w-5" />
							<span class="sr-only">Close modal</span>
						</button>
					</div>
					<div class="space-y-6 p-6">
						<slot />
					</div>
					<div
						class="flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-6">
						<slot name="actions" />
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
