<script lang="ts">
	import { ArrowRight } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { page } from '$app/stores'
	import Footer from '$components/footer/Footer.svelte'
	import Navigation from '$components/navigation/Navigation.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	let user = data.user
	let src = '/images/generic-error.svg'
	let title = 'Oh no!'
	let message = ''

	switch ($page.status) {
		case 404:
			src = '/images/not-found.svg'
			title = 'Uh, oh!'
			message = 'We looked far and wide but the page you are looking for does not exist.'
			break
		default:
			message = $page.error?.message ?? 'An error occurred'
			break
	}
</script>

<header>
	<Navigation {user} />
</header>
<div class="page w-full">
	<div class="flex flex-col py-12 md:flex-row md:py-32">
		<div class="flex flex-1 flex-col items-center">
			<img {src} alt="not-found-error" class="w-3/4" />
		</div>
		<div class="mt-16 flex flex-1 flex-col justify-start md:mt-0 md:items-start md:justify-center">
			<h1 class="page-header mb-2">{title}</h1>
			<p class="mb-8 text-gray-500">
				{message}
			</p>
			<a class="btn-primary flex flex-wrap" href="/"
				>Go Back to Home<Icon src={ArrowRight} class="ml-3 h-5 w-5" /></a>
		</div>
	</div>
</div>
<Footer />

<svelte:head>
	<title>Error - Kantina</title>
</svelte:head>
