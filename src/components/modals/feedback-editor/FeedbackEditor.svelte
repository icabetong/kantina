<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import { ExclamationTriangle, Star } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import Button from '$components/button/Button.svelte'
	import UserStore from '$stores/user'
	import Modal from '../Modal.svelte'

	const user = $UserStore
	export let isOpen: boolean
	export let product: Product

	let rating = 0
	const changeRating = (star: number) => (rating = star)

	let title: string = ''
	let description: string = ''
	const onSave = async () => {
		if (!user?.id) return

		isWorking = true
		try {
			await fetch('/api/rating', {
				method: 'POST',
				body: JSON.stringify({
					rating: {
						rating,
						title,
						description,
						product: product.id,
						user: user.id
					}
				})
			})
			toast.push('Feedback submitted')

			closeModal()
		} catch (e) {
			if (e instanceof Error) toast.push(e.message)
		} finally {
			isWorking = false
		}
	}

	let isWorking: boolean = false
	let error: string | null = null
</script>

<Modal {isOpen} title="Create Feedback" size="sm">
	<div class="flex flex-col">
		<p class="mb-8 text-gray-500">
			How satisfied are you with the product, and how likely are you gonna recommend these to your
			friends and peers?
		</p>
		<div class="flex items-center justify-center gap-4 mb-4 text-sm text-gray-400">
			<div>Not Satisfied</div>
			{#each Array(5) as _, index}
				<button type="button" id={`${index}`} on:click={() => changeRating(index + 1)}>
					<Icon
						src={Star}
						class="w-8 h-8 text-yellow-400"
						theme={index + 1 <= rating ? 'solid' : 'outline'} />
				</button>
			{/each}
			<div>Very Satisfied</div>
		</div>
		<div class="form-control-group">
			<label for="title" class="form-control-label">Summary</label>
			<input
				required
				type="text"
				id="title"
				class="form-control-input"
				aria-required="true"
				placeholder="A brief summary of your feedback"
				bind:value={title} />
		</div>
		<div class="form-control-group">
			<label for="description" class="form-control-label">Description</label>
			<textarea
				id="description"
				cols="10"
				rows="4"
				class="form-control-input"
				placeholder="Tell us what you think"
				bind:value={description} />
		</div>
		{#if error}
			<div class="alert-error">
				<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
				<span class="font-medium">{error}</span>
			</div>
		{/if}
	</div>

	<div slot="actions" class="flex flex-row gap-4">
		<Button type="button" isLoading={isWorking} loadingText="Saving" on:click={onSave}>Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
