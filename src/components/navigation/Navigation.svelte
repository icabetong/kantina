<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { createPopperActions } from 'svelte-popperjs'
	import {
		ArrowRightOnRectangle,
		BuildingStorefront,
		MagnifyingGlass,
		ShoppingBag,
		ShoppingCart,
		User,
		UserCircle
	} from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import pocketbase from '$lib/backend'
	import { parseFileUrl } from '$lib/files'
	import { clickOutside } from '$shared/directives/click-outside'
	import SearchQueryStore from '$stores/search-query'

	export let user: User | null
	export let cartItems: number = 0

	const { form, handleSubmit } = createForm({
		initialValues: {
			searchQuery: ''
		},
		onSubmit: (formData) => {
			let url = new URL('/search', $page.url.origin)
			url.searchParams.set('query', formData.searchQuery)

			goto(url, { invalidateAll: true, replaceState: true })
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
		modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
	}

	let currentQuery: string | null = null
	let dropdownOpened = false
	let searchOpened = false

	SearchQueryStore.subscribe((data) => (currentQuery = data))

	const onDropdownClick = (event: Event) => {
		const target = event.target as HTMLButtonElement
		const item = target.value

		switch (item) {
			case 'merchant':
				goto('/merchant')
				break
			case 'purchases':
				goto('/purchases')
				break
			case 'account':
				goto('/account')
				break
			case 'end':
				goto('/logout')
				break
		}
		dropdownOpened = false
	}

	const onEndSession = () => {
		return async ({ result }: { result: ActionResult }) => {
			pocketbase.authStore.clear()
			dropdownOpened = false
			await applyAction(result)
		}
	}
</script>

<nav class="border-gray-200 bg-white shadow">
	<div
		use:searchRef
		class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-4 md:px-12">
		<a href="/" class="flex items-center">
			<img
				src="/images/icon.png"
				class="mr-3 h-6 sm:h-9"
				height="36"
				width="36"
				alt="kantina logo" />
			<span class="self-center whitespace-nowrap text-2xl font-semibold text-red-600">
				Kantina
			</span>
		</a>
		{#if $page.url.pathname !== '/'}
			<div class="flex md:order-1 md:w-96">
				<div class="relative hidden sm:block sm:w-full">
					<form on:submit|preventDefault={handleSubmit}>
						<button
							type="submit"
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<span class="sr-only">Search icon</span>
							<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
						</button>
						<input
							required
							type="text"
							id="search-navbar"
							class="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 pl-10 text-sm text-gray-800 ring-2 ring-transparent transition-all focus:border-transparent focus:outline-none focus:ring-red-600"
							placeholder={currentQuery ?? 'Search for products...'}
							aria-required="true"
							bind:value={$form.searchQuery} />
					</form>
				</div>
			</div>
		{/if}
		<div class="flex items-center gap-6 md:order-2">
			{#if $page.url.pathname !== '/'}
				<button
					data-collapse-toggle="navbar-search"
					type="button"
					class="flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
					on:click={() => (searchOpened = !searchOpened)}>
					<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
					<span class="sr-only">Search</span>
				</button>
			{/if}
			{#if user}
				<a
					href="/cart"
					class="relative inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
					<Icon src={ShoppingCart} class="h-5 w-5 text-gray-500" />
					{#if cartItems > 0}
						<div
							class="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">
							{cartItems}
						</div>
					{/if}
				</a>
				<button
					use:dropdownRef
					on:click={() => (dropdownOpened = !dropdownOpened)}
					type="button"
					id="user-menu-button"
					aria-expanded={dropdownOpened}
					data-dropdown-toggle="user-dropdown"
					data-dropdown-placement="bottom">
					<span class="sr-only">Open user menu</span>
					{#if user.avatar}
						<img
							src={parseFileUrl('users', user.id, user.avatar)}
							alt="avatar"
							class="focus-ring-4 h-10 w-10 rounded-full focus:ring-gray-300" />
					{:else}
						<div
							class="rounded-full bg-gradient-to-br from-orange-500 to-pink-500 p-2 text-white focus:ring-4 focus:ring-orange-300">
							<Icon src={User} class=" h-5 w-5 text-sm" />
						</div>
					{/if}
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
			use:clickOutside
			use:dropdownContent={extraOptions}
			on:clickOutside={() => (dropdownOpened = !dropdownOpened)}
			class="z-50 list-none divide-y divide-gray-100 rounded border border-gray-200 bg-white text-base shadow-lg"
			id="user-dropdown">
			<div class="px-4 py-3">
				<span class="block text-sm text-gray-800">{`${user?.firstName} ${user?.lastName}`}</span>
				<span class="block truncate text-sm font-medium text-gray-500 "> {user?.email} </span>
			</div>
			<ul class="mt-0 flex flex-col pb-2 text-sm">
				{#if user?.type === 'merchant'}
					<li class="nav-dropdown-item">
						<button
							type="button"
							class="nav-dropdown-button"
							value="merchant"
							on:click={onDropdownClick}>
							<Icon src={BuildingStorefront} class="nav-dropdown-icon" />
							Merchant Center
						</button>
					</li>
				{/if}
				<li class="nav-dropdown-item">
					<button
						type="button"
						class="nav-dropdown-button"
						value="purchases"
						on:click={onDropdownClick}>
						<Icon src={ShoppingBag} class="nav-dropdown-icon" />
						Orders and Purchases
					</button>
				</li>
				<li class="nav-dropdown-item">
					<button
						type="button"
						class="nav-dropdown-button"
						value="account"
						on:click={onDropdownClick}>
						<Icon src={UserCircle} class="nav-dropdown-icon" />
						Account
					</button>
				</li>
				<li class="nav-dropdown-item">
					<form method="POST" action="/logout" use:enhance={onEndSession}>
						<button class="nav-dropdown-button" value="end">
							<Icon src={ArrowRightOnRectangle} class="nav-dropdown-icon" />
							Sign Out
						</button>
					</form>
				</li>
			</ul>
		</div>
	{/if}
	{#if searchOpened}
		<div class="w-full rounded-lg p-2" use:searchContent={extraOptions}>
			<form on:submit|preventDefault={handleSubmit}>
				<label
					for="default-search"
					class="sr-only mb-2 text-sm font-medium text-gray-800 dark:text-white">Search</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" />
					<input
						required
						type="search"
						id="searchQuery"
						class="block w-full rounded-lg bg-gray-100 p-4 text-sm text-gray-800 outline outline-gray-300 focus:outline-2 focus:outline-orange-500 focus:ring-orange-500"
						placeholder="Search for food, drinks, menus or stalls..."
						aria-required="true"
						bind:value={$form.searchQuery} />
					<button
						type="submit"
						class="absolute right-2.5 bottom-2.5 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-orange-300">
						<Icon src={MagnifyingGlass} class="h-5 w-5 text-white" />
						<span class="sr-only">Search</span></button>
				</div>
			</form>
		</div>
	{/if}
</nav>
