<script lang="ts">
	import { createPopperActions } from 'svelte-popperjs'
	import { ChevronDown } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { clickOutside } from '$shared/directives/click-outside'

	let isOpen = false
	const [dropdownRef, dropdownContent] = createPopperActions({
		placement: 'bottom-start'
	})
	const extraOptions = {
		modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
	}
</script>

<button
	use:dropdownRef
	type="button"
	id="dropdownToggleButton"
	data-dropdown-toggle="dropdownToggle"
	class="hover:bg-orang-700 inline-flex items-center rounded-lg bg-red-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-all hover:drop-shadow-md focus:outline-none focus:ring-4 focus:ring-red-300"
	on:click={() => (isOpen = !isOpen)}>
	Options
	<Icon src={ChevronDown} class="ml-2 h-4 w-4" theme="mini" />
</button>

<!-- Dropdown menu -->
{#if isOpen}
	<div
		use:clickOutside
		use:dropdownContent={extraOptions}
		on:clickOutside={() => (isOpen = !isOpen)}
		id="dropdownToggle"
		class="z-30 w-72 divide-y divide-gray-100 rounded bg-white drop-shadow">
		<div class="space-y-1 p-3 text-sm text-gray-700" aria-labelledby="dropdownToggleButton">
			<slot />
		</div>
	</div>
{/if}
