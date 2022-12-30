<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import PageProgress from '$components/page-progress/PageProgress.svelte'
	import '../app.css'
</script>

<PageProgress />
<slot />

<SvelteToast />
<Modals>
	<div
		slot="backdrop"
		class="fixed top-0 bottom-0 left-0 right-0 z-20 bg-black bg-opacity-50 transition-all"
		on:click={closeModal}
		on:keydown={null} />
</Modals>
