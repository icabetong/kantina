<script lang="ts">
	import { onMount } from 'svelte'
	import TabGroup from '$components/tab-group/TabGroup.svelte'
	import GeneralTab from './tabs/GeneralTab.svelte'
	import SecurityTab from './tabs/SecurityTab.svelte'

	const tabs = [
		{ id: 'general', title: 'General' },
		{ id: 'security', title: 'Security' }
	]
	let currentTab: string

	onMount(() => {
		currentTab = tabs[0].id
	})

	const onHandleTabChange = (tab: Kantina.Tab) => (currentTab = tab.id)
</script>

<div class="w-full">
	<TabGroup {tabs} {currentTab} onChange={onHandleTabChange}>
		{#if currentTab === 'general'}
			<GeneralTab />
		{:else if currentTab === 'security'}
			<SecurityTab />
		{/if}
	</TabGroup>
</div>
