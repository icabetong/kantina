<script lang="ts">
	export let currentTab: string
	export let tabs: Kantina.Tab[]
	export let onChange: (tab: Kantina.Tab) => void
</script>

<div class="flex-1 flex flex-col w-full md:flex-row md:gap-16">
	<div class="w-full h-fit mb-4 -m-b-1 md:hidden">
		<ul class="flex flex-wrap gap-4 text-sm font-medium text-center">
			{#each tabs as tab}
				<li role="presentation">
					<button
						type="button"
						role="tab"
						id={tab.id}
						data-tabs-target={tab.id}
						class="inline-flex px-6 py-2.5 rounded-t-lg transition-all border-b-2 border-transparent hover:bg-gray-100 aria-selected:border-orange-500 aria-selected:text-orange-500 aria-selected:bg-orange-50"
						aria-selected={tab.id === currentTab}
						on:click={() => onChange(tab)}>
						{tab.title ?? tab.id}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="h-full hidden md:block md:w-1/5">
		<ul class="flex flex-wrap -mb-px text-sm font-medium text-center gap-2">
			{#each tabs as tab}
				<li class="w-full" role="presentation">
					<button
						type="button"
						role="tab"
						id={tab.id}
						data-tabs-target={tab.id}
						class="w-full inline-flex px-6 py-3 rounded-tl-lg rounded-bl-lg transition-all border-r-2 border-transparent hover:bg-gray-100 aria-selected:border-orange-500 aria-selected:text-orange-500 aria-selected:bg-orange-50"
						aria-selected={tab.id === currentTab}
						on:click={() => onChange(tab)}>
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
