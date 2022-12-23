<script lang="ts">
	import { page } from '$app/stores'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, User } from '@steeze-ui/heroicons'
	import { createPopperActions } from 'svelte-popperjs'
	import SearchQueryStore from '../../stores/search-query'

	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom'
	})
	const extraOptions = {
		modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
	}

	let currentQuery: string | null = null
	let user: string | null = null

	let dropdownOpened = false
	SearchQueryStore.subscribe((data) => (currentQuery = data))
</script>

<nav class="bg-white border-gray-200 px-2 sm:px-4 md:px-8 py-2.5 shadow">
	<div
		class="container flex flex-wrap items-center justify-between mx-auto px-4 sm:px-0 max-w-screen-lg"
	>
		<div class="flex items-center">
			<span class="self-center text-xl font-semibold whitespace-nowrap ">
				<a href="/">Kantina</a>
			</span>
		</div>
		{#if $page.url.pathname !== '/'}
			<div class="flex md:order-1 md:w-96">
				<div class="relative hidden sm:block sm:w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<span class="sr-only">Search icon</span>
						<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
					</div>
					<input
						type="text"
						id="search-navbar"
						class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 focus:outline-orange-500"
						placeholder={currentQuery ?? 'Search for products...'}
					/>
				</div>
			</div>
		{/if}

		<div class="flex items-center gap-2 md:order-2">
			<button
				data-collapse-toggle="navbar-search"
				type="button"
				class="flex items-center mr-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
			>
				<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
				<span class="sr-only">Search</span>
			</button>
			{#if user}
				<button
					use:popperRef
					on:click={() => (dropdownOpened = !dropdownOpened)}
					type="button"
					class="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
					id="user-menu-button"
					aria-expanded={dropdownOpened}
					data-dropdown-toggle="user-dropdown"
					data-dropdown-placement="bottom"
				>
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
			use:popperContent={extraOptions}
			class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
			id="user-dropdown"
		>
			<div class="px-4 py-3 ">
				<span class="block text-sm text-gray-900">Kebab</span>
				<span class="block text-sm font-medium text-gray-500 truncate "> name@example.com </span>
			</div>
			<ul
				class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white "
			>
				<li
					class="block py-2 pl-3 pr-4 text-white bg-orange-700 rounded md:bg-transparent md:text-blue-orange md:p-0 "
				>
					<a href="/login">Login</a>
				</li>
			</ul>
		</div>
	{/if}
</nav>
