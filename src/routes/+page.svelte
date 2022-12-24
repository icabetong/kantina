<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass } from '@steeze-ui/heroicons'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	import { createForm } from 'svelte-forms-lib'
	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			searchQuery: ''
		},
		onSubmit: (formData) => {
			$page.url.searchParams.set('query', formData.searchQuery)
			goto(`/search?${$page.url.searchParams.toString()}`)
		}
	})
</script>

<div class="page">
	<div
		class="h-full flex flex-col px-8 py-12 items-center justify-start md:py-40 md:justify-center">
		<h1 class="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
			Discover new stalls and{' '}
			<span class="text-transparent bg-clip-text bg-gradient-to-r to-pink-500 from-orange-400">
				food
			</span>
		</h1>
		<p class="text-lg font-normal text-gray-500 lg:text-xl">
			Good food and drinks that are delicious that are affordable and with various choices.
		</p>
		<form class="mt-16 w-full md:w-3/4" on:submit|preventDefault={handleSubmit}>
			<label for="searchQuery" class="mb-2 text-sm font-medium text-gray-900 sr-only">
				Search
			</label>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-500" />
				</div>
				<input
					type="search"
					id="searchQuery"
					class="block w-full p-4 pl-10 text-sm text-gray-900 outline outline-gray-300 rounded-lg bg-gray-100 focus:ring-orange-500 focus:outline-2 focus:outline-orange-500"
					placeholder="Search for food, drinks, menus or stalls..."
					required
					on:change={handleChange}
					bind:value={$form.searchQuery} />
				<button
					type="submit"
					class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-r to-pink-500 from-orange-400 hidden font-medium rounded-lg text-sm px-4 py-2  focus:ring-4 focus:outline-none focus:ring-orange-300 md:block">
					Search
				</button>
			</div>
			<button
				type="submit"
				class="text-white bottom-2.5 bg-gradient-to-r to-pink-500 from-orange-400 font-medium rounded-lg text-sm px-4 py-2 w-full mt-4 focus:ring-4 focus:outline-none focus:ring-orange-300 md:hidden">
				Search
			</button>
		</form>
	</div>
</div>

<svelte:head>
	<title>Kantina</title>
</svelte:head>
