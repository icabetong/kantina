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

<div class="flex items-center p-2 rounded hover:bg-gray-100" data-testid="checkbox">
	<input
		{checked}
		id="checkbox-item-4"
		type="checkbox"
		class="w-4 h-4 text-orange-600 accent-orange-600 bg-gray-100 rounded border-gray-300 focus:ring-orange-500 focus:ring-2"
		on:change={onChange} />
	<label for="checkbox-item-4" class="ml-2 w-full text-sm font-medium text-gray-800 rounded">
		{label}
	</label>
</div>
