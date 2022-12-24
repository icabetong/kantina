<script>
	import Navigation from '$components/navigation/Navigation.svelte'
	import '../app.css'
</script>

<Navigation />
<main class="flex-1 px-2 sm:px-4 md:px-8">
	<slot />
</main>
