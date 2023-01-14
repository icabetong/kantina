<script lang="ts">
	import type { IconSource } from '@steeze-ui/heroicons/types'
	import { Icon } from '@steeze-ui/svelte-icon'

	export let icon: IconSource | string | null = null
	export let title: string
	export let message: string
</script>

<div
	class={`jusitfy-center mx-auto flex max-w-md flex-col items-center px-4 ${
		typeof icon === 'string' ? 'py-24' : 'py-40'
	}`}>
	{#if icon}
		{#if typeof icon === 'string'}
			<img src={icon} alt="svg" class="mb-8 h-56" />
		{:else}
			<div class="mb-2.5 rounded-full bg-gradient-to-br from-red-600 to-orange-500 p-3 text-white">
				<Icon src={icon} class="h-10 w-10" />
			</div>
		{/if}
	{/if}

	<h5 class="text-2xl font-semibold text-red-600">{title}</h5>
	<p class="text-center text-gray-500">{message}</p>
</div>
