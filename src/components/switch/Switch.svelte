<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatcher = createEventDispatcher()
	const onChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		dispatcher('change', { checked: target.checked })
	}

	export let checked: boolean = false
	export let label: string = ''
</script>

<div class="flex rounded p-2 hover:bg-gray-100" data-testid="switch">
	<label class="relative inline-flex w-full cursor-pointer items-center">
		<input type="checkbox" {checked} class="peer sr-only" on:change={onChange} />
		<div
			class="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-to-br peer-checked:from-orange-500 peer-checked:to-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300" />
		<span class="ml-3 text-sm font-medium text-gray-800">{label}</span>
	</label>
</div>
