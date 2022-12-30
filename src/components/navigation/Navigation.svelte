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
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { endSession } from '$lib/auth'
	import { parseFileUrl } from '$lib/files'
	import { clickOutside } from '$shared/click-outside'
	import SearchQueryStore from '$stores/search-query'
	import UserStore from '$stores/user'

	const user = $UserStore
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
				endSession()
				goto('/login')
				break
		}
		dropdownOpened = false
	}
</script>

<nav class="bg-white border-gray-200 shadow">
	<div
		use:searchRef
		class="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl px-4 py-4 md:px-12">
		<a
			href="/"
			class="flex items-center text-transparent bg-gradient-to-r bg-clip-text from-orange-500 to-pink-500">
			<img src="/images/icon.png" class="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap"> Kantina </span>
		</a>
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
							required
							type="text"
							id="search-navbar"
							class="block w-full p-2 pl-10 text-sm text-gray-800 border border-gray-200 rounded-lg bg-gray-50 ring-2 ring-transparent focus:ring-orange-500 focus:border-transparent focus:outline-none transition-all"
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
					class="flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
					on:click={() => (searchOpened = !searchOpened)}>
					<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
					<span class="sr-only">Search</span>
				</button>
			{/if}
			{#if user}
				<a
					href="/cart"
					class="relative inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
					<Icon src={ShoppingCart} class="h-5 w-5 text-gray-500" />
					{#if cartItems > 0}
						<div
							class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
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
							class="h-10 w-10 rounded-full focus-ring-4 focus:ring-gray-300" />
					{:else}
						<div
							class="p-2 bg-gradient-to-br rounded-full from-orange-500 to-pink-500 text-white focus:ring-4 focus:ring-orange-300">
							<Icon src={User} class=" text-sm h-5 w-5" />
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
			class="z-50 text-base list-none bg-white rounded shadow-lg border border-gray-200 divide-y divide-gray-100"
			id="user-dropdown">
			<div class="px-4 py-3">
				<span class="block text-sm text-gray-800">{`${user?.firstName} ${user?.lastName}`}</span>
				<span class="block text-sm font-medium text-gray-500 truncate "> {user?.email} </span>
			</div>
			<ul class="flex flex-col mt-0 pb-2 text-sm">
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
					<button type="button" class="nav-dropdown-button" value="end" on:click={onDropdownClick}>
						<Icon src={ArrowRightOnRectangle} class="nav-dropdown-icon" />
						Sign Out
					</button>
				</li>
			</ul>
		</div>
	{/if}
	{#if searchOpened}
		<div class="w-full rounded-lg p-2" use:searchContent={extraOptions}>
			<form on:submit|preventDefault={handleSubmit}>
				<label
					for="default-search"
					class="mb-2 text-sm font-medium text-gray-800 sr-only dark:text-white">Search</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" />
					<input
						required
						type="search"
						id="searchQuery"
						class="block w-full p-4 text-sm text-gray-800 outline outline-gray-300 rounded-lg bg-gray-100 focus:ring-orange-500 focus:outline-2 focus:outline-orange-500"
						placeholder="Search for food, drinks, menus or stalls..."
						aria-required="true"
						bind:value={$form.searchQuery} />
					<button
						type="submit"
						class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-br to-pink-500 from-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-2">
						<Icon src={MagnifyingGlass} class="h-5 w-5 text-white" />
						<span class="sr-only">Search</span></button>
				</div>
			</form>
		</div>
	{/if}
</nav>
