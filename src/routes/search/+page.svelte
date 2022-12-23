<script lang="ts">
	import { page } from '$app/stores'
	import SearchQueryStore from '../../stores/search-query'

	let query: string | null = null
	if ($page.url.searchParams.has('query')) {
		query = $page.url.searchParams.get('query')

		if (!!query) SearchQueryStore.update(() => query!)
	}
</script>

<div class="page">
	<h1>Showing results for <span class="font-semibold">{query}</span></h1>
</div>
