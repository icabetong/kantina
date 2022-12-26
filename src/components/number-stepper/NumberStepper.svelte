<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'
	import { Minus, Plus } from '@steeze-ui/heroicons'
	import { createEventDispatcher } from 'svelte'

	const dispatcher = createEventDispatcher()
	const increment = () => dispatcher('increment')
	const decrement = () => dispatcher('decrement')

	export let value: number
	export let min: number | null = null
	export let max: number | null = null

	let error: boolean = false

	$: {
		if ((max && value > max) || (min && value < min) || !value) error = true
		else error = false
	}
</script>

<div class="flex items-center space-x-3">
	<button type="button" class="stepper" on:click={decrement}>
		<span class="sr-only">Decrement button</span>
		<Icon src={Minus} class="h-4 w-4" />
	</button>
	<div>
		<input
			type="number"
			class={`bg-gray-50 w-14 border border-gray-300  text-sm rounded-lg ring-2 ring-transparent focus:border-transparent focus:outline-none block px-2.5 py-1 transition-all ${
				error ? 'text-red-500 focus:ring-red-500' : 'text-gray-800 focus:ring-orange-500'
			}`}
			bind:value
			{min}
			{max} />
	</div>
	<button type="button" class="stepper" on:click={increment}>
		<span class="sr-only">Increment button</span>
		<Icon src={Plus} class="h-4 w-4" />
	</button>
</div>

<style lang="postcss">
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	@tailwind components;

	@layer components {
		.stepper {
			@apply inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white rounded-full border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200;
		}
	}
</style>
