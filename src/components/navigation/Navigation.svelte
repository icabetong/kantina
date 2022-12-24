<script lang="ts">
	import { onDestroy } from 'svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { endSession } from '$lib/auth'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, User } from '@steeze-ui/heroicons'
	import { createPopperActions } from 'svelte-popperjs'
	import { createForm } from 'svelte-forms-lib'
	import SearchQueryStore from '$stores/search-query'
	import UserStore from '$stores/auth'
	import type { Record, Admin } from 'pocketbase'

	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			searchQuery: ''
		},
		onSubmit: (formData) => {
			let url = new URL($page.url)
			url.searchParams.set('query', formData.searchQuery)
			goto(url)

			if (searchOpened) searchOpened = !searchOpened
		}
	})
	const [searchRef, searchContent] = createPopperActions({
		placement: 'bottom'
	})
	const [dropdownRef, dropdownContent] = createPopperActions({
		placement: 'bottom-end'
	})
	const extraOptions = {
		modifiers: [{ name: 'offset', options: { offset: [0, 16] } }]
	}

	let currentQuery: string | null = null
	let user: Record | Admin | null = null

	let dropdownOpened = false
	let searchOpened = false

	const searchQueryUnsubscriber = SearchQueryStore.subscribe((data) => (currentQuery = data))
	const userUnsubscriber = UserStore.subscribe((data) => (user = data))

	const handleSignOut = () => {
		dropdownOpened = false
		endSession()

		goto('/login')
	}

	onDestroy(() => {
		searchQueryUnsubscriber()
		userUnsubscriber()
	})
</script>

<nav class="bg-white border-gray-200 px-2 sm:px-4 md:px-8 py-2.5 shadow">
	<div
		use:searchRef
		class="container flex flex-wrap items-center justify-between mx-auto px-4 sm:px-0 max-w-screen-lg">
		<div class="flex items-center">
			<span class="self-center text-xl font-semibold whitespace-nowrap ">
				<a href="/">Kantina</a>
			</span>
		</div>
		{#if $page.url.pathname !== '/'}
			<div class="flex md:order-1 md:w-96">
				<div class="relative hidden sm:block sm:w-full">
					<form on:submit|preventDefault={handleSubmit}>
						<button
							type="submit"
							class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<span class="sr-only">Search icon</span>
							<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
						</button>
						<input
							type="text"
							id="search-navbar"
							class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-orange-500 focus:outline-orange-500"
							placeholder={currentQuery ?? 'Search for products...'}
							on:change={handleChange}
							bind:value={$form.searchQuery} />
					</form>
				</div>
			</div>
		{/if}
		<div class="flex items-center gap-2 md:order-2">
			{#if $page.url.pathname !== '/'}
				<button
					data-collapse-toggle="navbar-search"
					type="button"
					class="flex items-center p-2 mr-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
					on:click={() => (searchOpened = !searchOpened)}>
					<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
					<span class="sr-only">Search</span>
				</button>
			{/if}
			{#if user}
				<button
					use:dropdownRef
					on:click={() => (dropdownOpened = !dropdownOpened)}
					type="button"
					class="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
					id="user-menu-button"
					aria-expanded={dropdownOpened}
					data-dropdown-toggle="user-dropdown"
					data-dropdown-placement="bottom">
					<span class="sr-only">Open user menu</span>
					<Icon src={User} class="h-5 w-5 text-gray-500" />
				</button>
			{:else}
				<div class="btn-outlined">
					<a href="/login">Login/Register</a>
				</div>
			{/if}
		</div>
	</div>
	{#if dropdownOpened}
		<div
			use:dropdownContent={extraOptions}
			class="z-50 text-base list-none bg-white rounded shadow"
			id="user-dropdown">
			<div class="px-4 py-3">
				<span class="block text-sm text-gray-900">{`${user?.firstName} ${user?.lastName}`}</span>
				<span class="block text-sm font-medium text-gray-500 truncate "> {user?.email} </span>
			</div>
			<ul
				class="flex flex-col mt-4 pb-2 border border-gray-100 rounded-lg bg-gray-50 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white ">
				<li class="nav-dropdown-item">
					<a href="/account">Account Settings</a>
				</li>
				<li class="nav-dropdown-item">
					<button type="button" class="w-full text-start" on:click={handleSignOut}>Sign Out</button>
				</li>
			</ul>
		</div>
	{/if}
	{#if searchOpened}
		<div class="w-full rounded-lg p-2" use:searchContent={extraOptions}>
			<form on:submit|preventDefault={handleSubmit}>
				<label
					for="default-search"
					class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" />
					<input
						type="search"
						id="searchQuery"
						class="block w-full p-4 text-sm text-gray-900 outline outline-gray-300 rounded-lg bg-gray-100 focus:ring-orange-500 focus:outline-2 focus:outline-orange-500"
						placeholder="Search for food, drinks, menus or stalls..."
						required
						on:change={handleChange}
						bind:value={$form.searchQuery} />
					<button
						type="submit"
						class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-r to-pink-500 from-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-2">
						<Icon src={MagnifyingGlass} class="h-5 w-5 text-white" />
						<span class="sr-only">Search</span></button>
				</div>
			</form>
		</div>
	{/if}
</nav>
