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

<div class="flex p-2 rounded hover:bg-gray-100">
	<label class="inline-flex relative items-center w-full cursor-pointer">
		<input type="checkbox" value={checked} class="sr-only peer" on:change={onChange} />
		<div
			class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-br peer-checked:from-orange-500 peer-checked:to-pink-500" />
		<span class="ml-3 text-sm font-medium text-gray-800">{label}</span>
	</label>
</div>
