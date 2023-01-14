<script lang="ts">
	import { onMount } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { navigating } from '$app/stores'

	const progress = tweened(0, {
		duration: 3500,
		easing: cubicOut
	})

	$: {
		if (navigating) progress.set(1, { duration: 1000 })
	}

	onMount(() => {
		progress.set(0.3)
	})
</script>

{#if $navigating}
	<div class="fixed top-0 left-0 right-0 z-20 h-0.5">
		<div
			class={`h-full bg-gradient-to-br from-orange-500 to-pink-500`}
			style={`width: ${$progress * 100}%`} />
	</div>
{/if}
