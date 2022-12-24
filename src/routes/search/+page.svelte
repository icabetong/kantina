<script lang="ts">
	import { page } from '$app/stores'
	import SearchQueryStore from '$stores/search-query'

	let query: string | null = null

	page.subscribe((value) => {
		if (value.url.searchParams.has('query')) {
			query = value.url.searchParams.get('query')

			if (!!query) SearchQueryStore.update(() => query!)
		}
	})
</script>

<div class="page w-full">
	<h1>Showing results for <span class="font-semibold">{query}</span></h1>
</div>
