<script lang="ts">
	import AccountTabs from '$components/account-tabs/AccountTabs.svelte'
</script>

<div class="bg-white min-h-screen text-gray-800">
	<div class="page w-full flex flex-col items-center justify-start pb-24">
		<h2 class="page-header w-full text-start">Account Settings</h2>
		<AccountTabs />
	</div>
</div>

<svelte:head>
	<title>Account Settings</title>
</svelte:head>
