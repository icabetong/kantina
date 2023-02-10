<script lang="ts">
	import { ArrowRight } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { page } from '$app/stores'
</script>

<div class="page w-full">
	<div class="flex flex-col py-12 md:flex-row md:py-32">
		<div class="flex flex-1 flex-col items-center">
			<img src="/images/product-not-found.svg" alt="not-found-error" class="w-3/4" />
		</div>
		<div class="mt-16 flex flex-1 flex-col justify-start md:mt-0 md:items-start md:justify-center">
			<h1 class="page-header mb-2">{$page.error?.message}</h1>
			<p class="mb-8 text-gray-500">
				The product you are searching for is not found, maybe it isn't cooked yet?
			</p>
			<a class="btn-primary flex flex-wrap" href="/"
				>Go Back to Home<Icon src={ArrowRight} class="ml-3 h-5 w-5" /></a>
		</div>
	</div>
</div>

<svelte:head>
	<title>Error - Kantina</title>
</svelte:head>
