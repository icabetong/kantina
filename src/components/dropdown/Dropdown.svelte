<script>
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ChevronDown } from '@steeze-ui/heroicons'
	import { createPopperActions } from 'svelte-popperjs'
	import Switch from '$components/switch/Switch.svelte'
	import { clickOutside } from '$shared/click-outside'

	let isOpen = false
	const [dropdownRef, dropdownContent] = createPopperActions({
		placement: 'bottom-end'
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
	class="text-white bg-orange-500 hover:bg-orang-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
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
		class="z-30 w-72 bg-white rounded divide-y divide-gray-100 drop-shadow">
		<div class="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownToggleButton">
			<slot />
		</div>
	</div>
{/if}
