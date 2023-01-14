<script lang="ts">
	import AccountTabs from '$components/account-tabs/AccountTabs.svelte'
</script>

<div class="page flex min-h-screen w-full flex-col items-center justify-center">
	<h2 class="page-header mb-8 w-full text-start">Account Settings</h2>
	<AccountTabs />
</div>

<svelte:head>
	<title>Account Settings</title>
</svelte:head>
