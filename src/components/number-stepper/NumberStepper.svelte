<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Minus, Plus } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'

	const dispatcher = createEventDispatcher()
	const increment = () => dispatcher('increment')
	const decrement = () => dispatcher('decrement')

	export let value: number
	export let min: number | null = null
	export let max: number | null = null
	export let disabled: boolean = false

	let error: boolean = false

	$: {
		if ((max && value > max) || (min && value < min) || !value) error = true
		else error = false
	}
</script>

<div class="flex items-center space-x-3">
	<button {disabled} type="button" class="stepper" on:click={decrement}>
		<span class="sr-only">Decrement button</span>
		<Icon src={Minus} class="h-4 w-4" />
	</button>
	<div>
		<input
			{min}
			{max}
			{disabled}
			type="number"
			class={`block w-14 rounded-lg border  border-gray-300 bg-gray-50 px-2.5 py-1 text-sm ring-2 ring-transparent transition-all focus:border-transparent focus:outline-none ${
				error ? 'text-red-500 focus:ring-red-500' : 'text-gray-800 focus:ring-orange-500'
			}`}
			aria-disabled={disabled}
			bind:value />
	</div>
	<button {disabled} type="button" class="stepper" on:click={increment}>
		<span class="sr-only">Increment button</span>
		<Icon src={Plus} class="h-4 w-4" />
	</button>
</div>

<style lang="postcss">
	.stepper {
		@apply inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:text-gray-300 disabled:hover:bg-white;
	}
</style>
