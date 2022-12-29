<script lang="ts">
	import { onMount } from 'svelte'
	import { UserCircle, LockClosed } from '@steeze-ui/heroicons'
	import TabGroup from '$components/tab-group/TabGroup.svelte'
	import GeneralTab from './tabs/GeneralTab.svelte'
	import SecurityTab from './tabs/SecurityTab.svelte'

	const tabs = [
		{ icon: UserCircle, id: 'general', title: 'General' },
		{ icon: LockClosed, id: 'security', title: 'Security' }
	]
	let currentTab: string

	onMount(() => {
		currentTab = tabs[0].id
	})

	const onTabChange = (tab: Kantina.Tab) => (currentTab = tab.id)
</script>

<TabGroup {tabs} {currentTab} onChange={onTabChange}>
	{#if currentTab === 'general'}
		<GeneralTab />
	{:else if currentTab === 'security'}
		<SecurityTab />
	{/if}
</TabGroup>
