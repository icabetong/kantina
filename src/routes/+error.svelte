<script>
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ArrowRight } from '@steeze-ui/heroicons'
	import { page } from '$app/stores'
	import Navigation from '$components/navigation/Navigation.svelte'
	import Footer from '$components/footer/Footer.svelte'

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
	<Navigation />
</header>
<div class="page w-full">
	<div class="flex flex-col md:flex-row py-12 md:py-32">
		<div class="flex-1 flex flex-col items-center">
			<img {src} alt="not-found-error" class="w-3/4" />
		</div>
		<div class="flex-1 flex flex-col justify-start mt-16 md:mt-0 md:justify-center md:items-start">
			<h1 class="page-header mb-2">{title}</h1>
			<p class="text-gray-500 mb-8">
				{message}
			</p>
			<a class="btn-primary flex flex-wrap" href="/"
				>Go Back to Home<Icon src={ArrowRight} class="h-5 w-5 ml-3" /></a>
		</div>
	</div>
</div>
<Footer />

<svelte:head>
	<title>Error - Kantina</title>
</svelte:head>
