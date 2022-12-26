<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ChevronLeft, ChevronRight } from '@steeze-ui/heroicons'

	const dispatch = createEventDispatcher()
	const previous = () => dispatch('previous')
	const next = () => dispatch('next')

	export let totalPages: number
	export let currentPage: number
	export let perPage: number
	export let totalItems: number

	let start: number = 1
	let end: number = totalItems >= perPage ? perPage : totalItems

	const pages = Array(5)
		.fill(0)
		.map((_, index) => index + 1)
</script>

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
	{#if totalPages > currentPage}
		<div class="flex-1 flex justify-end">
			<ul class="pagination">
				<li class="pagination-prev">
					<button type="button" on:click={previous}>
						<Icon src={ChevronLeft} class="h-3 w-3" />
					</button>
				</li>
				{#each pages as page}
					<li
						class={`pagination-number ${
							currentPage === page &&
							'bg-orange-50 text-orange-500 border-orange-500 hover:text-orange-500 hover:bg-orange-100 z-[1]'
						}`}>
						<button type="button">{page}</button>
					</li>
				{/each}
				{#if totalPages > 5}
					<li class="pagination-number">
						<button type="button">...</button>
					</li>
				{/if}
				<li class="pagination-next">
					<button type="button" on:click={next}>
						<Icon src={ChevronRight} class="h-3 w-3" />
					</button>
				</li>
			</ul>
		</div>
	{/if}
</div>
