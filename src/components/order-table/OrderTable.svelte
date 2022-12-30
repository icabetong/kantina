<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { Banknotes, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import ConfirmModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import pocketbase from '$lib/backend'
	import { getCurrencyFormatter, getDateTimeFormatter } from '$shared/formatter'
	import { getFullName } from '$shared/user'

	const dispatch = createEventDispatcher<TableEvent<Order>>()

	const currencyFormatter = getCurrencyFormatter()
	const dateFormatter = getDateTimeFormatter()
	export let orders: Order[] = []
	export let showId: boolean = false

	const onHandleSelect = (order: Order) => dispatch('select', order)
	const onMarkAsPaid = (event: Event) => {
		try {
			const target = event.target as HTMLButtonElement
			const index: number = target.value ? parseInt(target.value) : -1

			if (index < 0) return
			const order = orders[index]

			openModal(ConfirmModal, {
				title: 'Mark as Paid',
				message:
					"Do you want to mark this order as paid? For everyone's security, this action cannot be undone.",
				confirmText: 'Continue',
				abandonText: 'Cancel',
				confirm: async () => {
					await pocketbase.collection('orders').update(order.id, { status: 'paid' })
				}
			})
		} catch (ignored) {}
	}
	const onMarkAsRejected = (event: Event) => {
		try {
			const target = event.target as HTMLButtonElement
			const index: number = target.value ? parseInt(target.value) : -1

			if (index < 0) return
			const order = orders[index]

			openModal(ConfirmModal, {
				title: 'Mark as Rejected',
				message:
					"Do you want to mark this order as rejected? For everyone's security, this action cannot be undone.",
				confirmText: 'Continue',
				abandonText: 'Cancel',
				confirm: async () => {
					await pocketbase.collection('orders').update(order.id, { status: 'rejected' })
				}
			})
		} catch (ignored) {}
	}
</script>

<div class="overflow-x-auto relative">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs uppercase bg-gray-100 text-gray-700">
			<tr>
				{#if showId}
					<th scope="col" class="py-3 px-6 rounded-l-lg">
						<span>Order ID</span>
					</th>
				{/if}
				<th scope="col" class={`py-3 px-6 ${!showId ? 'rounded-l-lg' : ''}`}> Customer </th>
				<th scope="col" class="py-3 px-6"> Status </th>
				<th scope="col" class="py-3 px-6 ">Total Payment</th>
				<th scope="col" class="py-3 px-6"> Created </th>

				<th scope="col" class="py-3 px-6 rounded-r-lg">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-y-gray-100">
			{#each orders as order, index}
				<tr
					class="bg-white hover:bg-gray-50 rounded-lg cursor-pointer"
					on:click={() => onHandleSelect(order)}>
					{#if showId}
						<td class="px-6">{order.id}</td>
					{/if}
					<th scope="row" class="py-2 px-6 font-medium text-gray-800 whitespace-nowrap">
						{order.expand && getFullName(order.expand?.customer)}
					</th>
					<td class="p-6 font-medium">
						{#if order.status === 'complete'}
							<span class="badge-green capitalize">{order.status}</span>
						{:else if order.status === 'paid'}
							<span class="badge-blue capitalize">{order.status}</span>
						{:else if order.status === 'pending'}
							<span class="badge-yellow capitalize">{order.status}</span>
						{:else}
							<span class="badge-red capitalize">{order.status}</span>
						{/if}
					</td>
					<td class="p-6">
						{currencyFormatter.format(order.total)}
					</td>
					<td class="p-6">
						<time datetime={order.created}>
							{dateFormatter.format(new Date(order.created))}
						</time>
					</td>
					<td class="p-6 flex items-center">
						{#if order.status === 'pending'}
							<button
								type="button"
								value={index}
								class="action"
								on:click|stopPropagation={onMarkAsPaid}>
								<Icon src={Banknotes} class="w-5 h-5" />
							</button>
							<button
								type="button"
								value={index}
								class="action"
								on:click|stopPropagation={onMarkAsRejected}>
								<Icon src={XMark} class="w-5 h-5" />
							</button>
						{:else}
							<span>No Actions Available</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	.action {
		@apply p-2 rounded-lg text-gray-700 flex items-center hover:bg-gray-200;
	}
</style>
