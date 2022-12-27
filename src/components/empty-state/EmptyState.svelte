<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { IconSource } from '@steeze-ui/heroicons/types'

	export let icon: IconSource | string | null = null
	export let title: string
	export let message: string
</script>

<div
	class={`flex flex-col items-center jusitfy-center px-4 max-w-md mx-auto ${
		typeof icon === 'string' ? 'py-24' : 'py-40'
	}`}>
	{#if icon}
		{#if typeof icon === 'string'}
			<img src={icon} alt="svg" class="h-56 mb-8" />
		{:else}
			<div class="mb-2.5 p-3 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-full">
				<Icon src={icon} class="h-10 w-10" />
			</div>
		{/if}
	{/if}

	<h5 class="text-2xl text-orange-500 font-semibold">{title}</h5>
	<p class="text-gray-500 text-center">{message}</p>
</div>
