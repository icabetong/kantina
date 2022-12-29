<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'

	export let currentTab: string
	export let tabs: Kantina.Tab[]
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'
	export let onChange: (tab: Kantina.Tab) => void
</script>

{#if orientation === 'horizontal'}
	<div class="w-full flex-1 flex flex-col">
		<div class="w-full h-fit mb-8 -m-b-1 border-b border-gray-200">
			<ul class="flex flex-wrap -mb-px gap-2">
				{#each tabs as tab}
					<li role="presentation">
						<button
							type="button"
							role="tab"
							id={tab.id}
							data-tabs-target={tab.id}
							class="inline-flex items-center rounded-t-lg text-sm font-medium px-4 py-2.5 border-b-2 border-transparent hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 aria-selected:border-orange-500 aria-selected:text-orange-500 transition-all"
							aria-selected={tab.id === currentTab}
							on:click={() => onChange(tab)}>
							{#if tab.icon}
								<Icon src={tab.icon} class="h-4 w-4 mr-2" />
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
