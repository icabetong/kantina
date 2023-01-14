<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'

	const dispatch = createEventDispatcher<{ previous: never; next: never; change: number }>()
	const previous = () => dispatch('previous')
	const next = () => dispatch('next')
	export let onPageChange = (event: Event) => {
		try {
			const target = event.target as HTMLButtonElement
			const page = target.value ? parseInt(target.value) : 0

			if (page >= 0) dispatch('change', page)
		} catch (ignored) {}
	}

	export let hidePages: boolean = true
	export let totalPages: number
	export let currentPage: number
	export let perPage: number
	export let totalItems: number

	// used for current item and total items infomration
	let start: number = 1
	let end: number = totalItems >= perPage ? perPage : totalItems
	let disablePrevious: boolean
	let disableNext: boolean

	$: {
		disablePrevious = currentPage === 1
		disableNext = currentPage + 1 > totalPages
	}
</script>

{#if hidePages}
	<div class="flex gap-3">
		<button
			type="button"
			class="pagination-page-action"
			disabled={disablePrevious}
			aria-disabled={disablePrevious}
			on:click={previous}>
			<Icon src={ArrowLeft} class="mr-2 h-3 w-3" />
			Previous
		</button>
		<button
			type="button"
			class="pagination-page-action"
			disabled={disableNext}
			aria-disabled={disableNext}
			on:click={next}>
			Next
			<Icon src={ArrowRight} class="ml-2 h-3 w-3" />
		</button>
	</div>
{:else}
	<div class="flex w-full flex-row items-center">
		<div class="text-md flex-1 text-gray-500">
			Showing
			<span class="font-bold text-gray-800">
				{#if start === end}
					{start}
				{:else}
					{start}-{end}
				{/if}
			</span>
			items of
			<span class="font-bold text-gray-800">{totalItems}</span> total
		</div>
		{#if totalPages >= currentPage}
			<div class="flex flex-1 justify-end">
				<ul class="flex items-center gap-2">
					<li>
						<button
							type="button"
							disabled={disablePrevious}
							aria-disabled={disablePrevious}
							class="pagination-page-number p-2"
							on:click={previous}>
							<Icon src={ChevronLeft} class="h-4 w-4" />
						</button>
					</li>
					{#each Array(totalPages) as _, index}
						<li>
							<button
								type="button"
								value={index + 1}
								class={`pagination-page-number ${
									currentPage === index + 1 &&
									'z-10 border-red-300 bg-orange-50 text-red-600 hover:border-red-600 hover:bg-red-100 hover:text-red-500'
								}`}
								on:click={onPageChange}>
								{index + 1}
							</button>
						</li>
					{/each}
					<li>
						<button
							type="button"
							disabled={disableNext}
							aria-disabled={disableNext}
							class="pagination-page-number p-2"
							on:click={next}>
							<Icon src={ChevronRight} class="h-4 w-4" />
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}
