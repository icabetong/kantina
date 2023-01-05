<script lang="ts">
	import { ArrowRight } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { page } from '$app/stores'
</script>

<div class="page w-full">
	<div class="flex flex-col md:flex-row py-12 md:py-32">
		<div class="flex-1 flex flex-col items-center">
			<img src="/images/product-not-found.svg" alt="not-found-error" class="w-3/4" />
		</div>
		<div class="flex-1 flex flex-col justify-start mt-16 md:mt-0 md:justify-center md:items-start">
			<h1 class="page-header mb-2">{$page.error?.message}</h1>
			<p class="text-gray-500 mb-8">
				The product you are searching for is not found, maybe it isn't cooked yet?
			</p>
			<a class="btn-primary flex flex-wrap" href="/"
				>Go Back to Home<Icon src={ArrowRight} class="h-5 w-5 ml-3" /></a>
		</div>
	</div>
</div>

<svelte:head>
	<title>Error - Kantina</title>
</svelte:head>
