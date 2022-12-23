<script lang="ts">
	import { onDestroy } from 'svelte'
	import { page } from '$app/stores'
	import SearchQueryStore from '../../stores/search-query'

	let query: string | null = null

	const unsubscribe = page.subscribe((value) => {
		if (value.url.searchParams.has('query')) {
			query = value.url.searchParams.get('query')

			if (!!query) SearchQueryStore.update(() => query!)
		}
	})

	onDestroy(unsubscribe)
</script>

<div class="page">
	<h1>Showing results for <span class="font-semibold">{query}</span></h1>
</div>
