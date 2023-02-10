<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import { MagnifyingGlass, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Header from '$components/header/Header.svelte'
	import UserTable from '$components/user-table/UserTable.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	let users: User[]
	let currentPage: number
	let perPage: number
	let totalItems: number
	let totalPages: number

	$: {
		users = data.users
		totalItems = data.count
		totalPages = data.pages
		currentPage = data.page
		perPage = data.paginated
	}

	const onFormReset = () => {
		const destinationURL = new URL($page.url)
		const urlParams = destinationURL.searchParams
		urlParams.delete('query')

		goto(destinationURL, { replaceState: true })
	}
	const { form, handleSubmit } = createForm({
		initialValues: {
			query: ''
		},
		onSubmit: async (form) => {
			if (!form.query) return

			const destinationURL = new URL($page.url)
			const urlParams = destinationURL.searchParams
			urlParams.set('query', form.query)

			goto(destinationURL, { replaceState: true })
		}
	})

	const onSearchQueryChanged = (event: KeyboardEvent) => {
		if (event.code === 'Enter' || event.code === 'Backspace') {
			const query: string =
				event.target && 'value' in event.target ? (event.target.value as string) : ''
			// use form to handle
			if (query.trim().length > 0) return

			const destinationURL = new URL($page.url)
			const urlParams = destinationURL.searchParams
			urlParams.delete('query')

			goto(destinationURL, { replaceState: true })
		}
	}
	const onChangeUserStatus = async (user: User, status: string) => {
		try {
			let newStatus: string | null = status
			if (
				(user.status === 'banned' && status === 'banned') ||
				(user.status === 'suspended' && status === 'suspended')
			) {
				newStatus = null
			}

			await fetch(`/api/users/${user.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ ...user, status: newStatus })
			})
			toast.push('Updated account status')
		} catch (e) {
			toast.push('Error updating account status')
		}
	}
</script>

<Header />
<div class="h-full w-full bg-white">
	<div class="m-auto max-w-screen-xl p-8 xl:p-0">
		<h1 class="my-8 text-2xl font-semibold">User Management</h1>
		<div class="mb-8 flex flex-initial items-center justify-end gap-2">
			<form on:submit|preventDefault={handleSubmit} on:reset={onFormReset}>
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative w-full md:w-fit">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon src={MagnifyingGlass} class="h-5 w-5" />
					</div>
					<input
						type="text"
						id="table-search"
						class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 pr-10 text-sm text-gray-800 shadow ring-2 ring-transparent transition-all focus:border-transparent focus:outline-none focus:ring-red-500 md:w-80"
						placeholder="Search for items"
						on:keyup={onSearchQueryChanged}
						bind:value={$form.query} />
					{#if $form.query && $form.query.length > 0}
						<button
							type="reset"
							class="absolute inset-y-0 right-0 m-2 flex items-center rounded-lg p-1 hover:bg-gray-100">
							<Icon src={XMark} class="h-5 w-5" />
						</button>
					{/if}
				</div>
				<button
					type="submit"
					class="ml-2 hidden rounded-lg border border-red-500 bg-red-500 p-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300">
					<Icon src={MagnifyingGlass} class="h-5 w-5" />
					<span class="sr-only">Search</span>
				</button>
			</form>
		</div>
		<UserTable
			{users}
			on:ban={(e) => onChangeUserStatus(e.detail, 'banned')}
			on:suspend={(e) => onChangeUserStatus(e.detail, 'suspended')} />
	</div>
</div>
