<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from '@steeze-ui/heroicons'

	const dispatch = createEventDispatcher()
	const previous = () => dispatch('previous')
	const next = () => dispatch('next')

	export let hidePages: boolean = true
	export let totalPages: number
	export let currentPage: number
	export let perPage: number
	export let totalItems: number
	export let onPageChange: (page: number) => void

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
			<Icon src={ArrowLeft} class="h-3 w-3 mr-2" />
			Previous
		</button>
		<button
			type="button"
			class="pagination-page-action"
			disabled={disableNext}
			aria-disabled={disableNext}
			on:click={next}>
			Next
			<Icon src={ArrowRight} class="h-3 w-3 ml-2" />
		</button>
	</div>
{:else}
	<div class="flex flex-row items-center w-full py-4">
		<div class="flex-1 text-gray-500 text-md">
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
			<div class="flex-1 flex justify-end">
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
								class={`pagination-page-number ${
									currentPage === index + 1 &&
									'bg-orange-50 border-orange-300 text-orange-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-100 z-10'
								}`}
								on:click={() => onPageChange(index + 1)}>
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
