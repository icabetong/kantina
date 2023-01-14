<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from '@steeze-ui/svelte-icon'

	const dispatch = createEventDispatcher<{ change: string }>()

	export let currentTab: string
	export let tabs: Kantina.Tab[]
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'

	const onTabSelected = (event: Event) => {
		const target = event.target as HTMLButtonElement
		dispatch('change', target.value)
	}
</script>

{#if orientation === 'horizontal'}
	<div class="flex w-full flex-1 flex-col">
		<div class="-m-b-1 mb-8 h-fit w-full border-b border-gray-200">
			<ul class="-mb-px flex flex-wrap gap-2">
				{#each tabs as tab}
					<li role="presentation">
						<button
							type="button"
							role="tab"
							id={tab.id}
							value={tab.id}
							class="inline-flex items-center rounded-t-lg border-b-2 border-transparent px-4 py-2.5 text-sm font-medium transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600 aria-selected:border-orange-500 aria-selected:text-orange-500"
							aria-selected={tab.id === currentTab}
							data-tabs-target={tab.id}
							on:click={onTabSelected}>
							{#if tab.icon}
								<Icon src={tab.icon} class="mr-2 h-4 w-4" />
							{/if}
							{tab.title ?? tab.id}
						</button>
					</li>
				{/each}
			</ul>
		</div>
		<div class="w-full md:w-4/5">
			<slot />
		</div>
	</div>
{/if}
