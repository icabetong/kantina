<script lang="ts">
	export let currentTab: string
	export let tabs: App.Tab[]
	export let onChange: (tab: App.Tab) => void
</script>

<div class="w-full h-fit mb-4 border-b border-gray-200">
	<ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
		{#each tabs as tab}
			<li role="presentation">
				<button
					type="button"
					role="tab"
					id={tab.id}
					data-tabs-target={tab.id}
					class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent group transition-all hover:text-gray-600 hover:border-gray-300 aria-selected:text-orange-500 aria-selected:border-orange-500"
					aria-selected={tab.id === currentTab}
					on:click={() => onChange(tab)}>
					{tab.title ?? tab.id}
				</button>
			</li>
		{/each}
	</ul>
</div>
<slot />
