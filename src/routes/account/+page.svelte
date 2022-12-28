<script lang="ts">
	import AccountTabs from '$components/account-tabs/AccountTabs.svelte'
</script>

<div class="page w-full min-h-screen flex flex-col items-center justify-center">
	<h2 class="page-header w-full text-start mb-8">Account Settings</h2>
	<AccountTabs />
</div>

<svelte:head>
	<title>Account Settings</title>
</svelte:head>
