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

<div class="flex items-center rounded p-2 hover:bg-gray-100" data-testid="checkbox">
	<input
		{checked}
		id="checkbox-item-4"
		type="checkbox"
		class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-orange-600 accent-orange-600 focus:ring-2 focus:ring-orange-500"
		on:change={onChange} />
	<label for="checkbox-item-4" class="ml-2 w-full rounded text-sm font-medium text-gray-800">
		{label}
	</label>
</div>
