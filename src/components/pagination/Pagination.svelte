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
	export let onPageChange = (page: number) => {}

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
			class="action"
			disabled={disablePrevious}
			aria-disabled={disablePrevious}
			on:click={previous}>
			<Icon src={ArrowLeft} class="h-3 w-3 mr-2" />
			Previous
		</button>
		<button
			type="button"
			class="action"
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
				<ul class="pagination">
					<li class="pagination-prev">
						<button type="button" on:click={previous}>
							<Icon src={ChevronLeft} class="h-3 w-3" />
						</button>
					</li>
					{#each Array(totalPages) as _, index}
						<li
							class={`pagination-number ${
								currentPage === index + 1 &&
								'bg-orange-50 text-orange-500 border-orange-500 hover:text-orange-500 hover:bg-orange-100 z-[1]'
							}`}>
							<button type="button" on:click={() => onPageChange(index + 1)}>{index + 1}</button>
						</li>
					{/each}
					<li class="pagination-next">
						<button type="button" on:click={next}>
							<Icon src={ChevronRight} class="h-3 w-3" />
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	@tailwind components;

	@layer components {
		.action {
			@apply inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300 disabled:hover:cursor-not-allowed;
		}
	}
</style>
