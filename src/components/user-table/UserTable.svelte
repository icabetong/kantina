<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Clock, XCircle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import Dropdown from '$components/dropdown/Dropdown.svelte'
	import { parseFileUrl } from '$lib/files'
	import { capitalize, getFullName } from '$shared/user'

	const dispatcher = createEventDispatcher<TableEvent<User> & { suspend: User; ban: User }>()

	export let users: User[]
</script>

<table class="w-full text-left text-sm text-gray-500 ">
	<thead class="bg-gray-50 text-xs uppercase text-gray-700 ">
		<tr>
			<th scope="col" class="px-6 py-3"> ID Number </th>
			<th scope="col" class="px-6 py-3"> Name </th>
			<th scope="col" class="px-6 py-3"> Type </th>
			<th scope="col" class="px-6 py-3"> Status </th>
			<th scope="col" class="px-6 py-3"> Action </th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr class="border-b bg-white hover:bg-gray-50">
				<td class="px-6 py-4 text-gray-900">
					{#if !!user.idNumber}
						<span>{user.idNumber}</span>
					{:else}
						<span class="rounded-lg bg-red-50 px-2 py-1 text-red-800">No Data</span>
					{/if}
				</td>
				<th scope="row" class="flex items-center whitespace-nowrap px-6 py-4 text-gray-900">
					{#if user.avatar}
						<img
							class="h-10 w-10 rounded-full"
							src={parseFileUrl('users', user.id, user?.avatar)}
							alt={`${user.firstName} image`} />
					{/if}
					<div class="pl-3">
						<div class="text-base font-semibold">{getFullName(user)}</div>
						<div class="font-normal text-gray-500">{user.email}</div>
					</div>
				</th>
				<td class="px-6 py-4"> {capitalize(user.type)} </td>
				<td class="px-6 py-4">
					<div class="flex items-center">
						{#if user?.status === 'banned'}
							<div class="mr-2 h-2.5 w-2.5 rounded-full bg-red-500" />
						{:else if user?.status === 'suspended'}
							<div class="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
						{:else if user?.status === 'deactivated'}
							<div class="mr-2 h-2.5 w-2.5 rounded-full bg-yellow-500" />
						{:else}
							<div class="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" />
						{/if}
						{user.status ? capitalize(user.status) : 'Normal'}
					</div>
				</td>
				<td class="relative px-6 py-4">
					{#if user.status !== 'deactivated'}
						<Dropdown>
							{#if user.status !== 'banned'}
								<button
									type="button"
									class="flex w-full items-center rounded p-2 font-semibold hover:bg-gray-200"
									on:click={() => dispatcher('suspend', user)}>
									<Icon src={Clock} class="mr-3 h-6 w-6" />
									{user.status === 'suspended' ? 'Remove Suspension' : 'Suspend'}
								</button>
							{/if}
							{#if user.status !== 'suspended'}
								<button
									type="button"
									class="flex w-full items-center p-2 font-semibold hover:bg-gray-200"
									on:click={() => dispatcher('ban', user)}>
									<Icon src={XCircle} class="mr-3 h-6 w-6" />
									{user.status === 'banned' ? 'Remove Ban' : 'Ban'}
								</button>
							{/if}
						</Dropdown>
					{:else}
						<span>No Actions Available</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
