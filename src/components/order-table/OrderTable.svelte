<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { Banknotes, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
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
					await fetch(`/api/order/${order.id}`, {
						method: 'PATCH',
						body: JSON.stringify({ product: { status: 'paid' } })
					})
					toast.push('Order marked as Paid')

					goto($page.url, { replaceState: true })
				}
			})
		} catch (e) {
			if (e instanceof Error) toast.push(e.message)
			else toast.push('An Error Occurred')
		}
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
					await fetch(`/api/order/${order.id}`, {
						method: 'PATCH',
						body: JSON.stringify({ product: { status: 'rejected' } })
					})
					toast.push('Order marked as Rejected')

					goto($page.url, { replaceState: true })
				}
			})
		} catch (e) {
			if (e instanceof Error) toast.push(e.message)
			else toast.push('An Error Occurred')
		}
	}
</script>

<div class="flex-1 overflow-x-auto mb-4 relative border border-gray-100 rounded-lg">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs uppercase text-gray-700 border-b border-gray-100">
			<tr>
				{#if showId}
					<th scope="col" class="py-3 px-6 rounded-l-lg">
						<span>Order ID</span>
					</th>
				{/if}
				<th scope="col" class="py-3 px-4"> Customer </th>
				<th scope="col" class="py-3 px-4"> Status </th>
				<th scope="col" class="py-3 px-4">Total Payment</th>
				<th scope="col" class="py-3 px-4"> Created </th>

				<th scope="col" class="py-3 px-4 rounded-r-lg">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-y-gray-100">
			{#each orders as order, index}
				<tr
					class="bg-white hover:bg-gray-50 rounded-lg cursor-pointer"
					on:click={() => onHandleSelect(order)}>
					{#if showId}
						<td class="px-4">{order.id}</td>
					{/if}
					<th scope="row" class="py-2 px-4 font-medium text-gray-800 whitespace-nowrap">
						{order.expand && getFullName(order.expand?.customer)}
						<p class="font-normal text-xs text-gray-500">
							{order.expand && order.expand.customer.email}
						</p>
					</th>
					<td class="px-4 py-2 font-medium">
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
					<td class="px-4 py-2">
						{currencyFormatter.format(order.total)}
					</td>
					<td class="px-4 py-2">
						<time datetime={order.created}>
							{dateFormatter.format(new Date(order.created))}
						</time>
					</td>
					<td class="px-4 py-2 flex items-center justify-center">
						<button
							type="button"
							value={index}
							class="action"
							disabled={order.status !== 'pending'}
							aria-disabled={order.status === 'pending'}
							on:click|stopPropagation={onMarkAsPaid}>
							<Icon src={Banknotes} class="w-5 h-5" />
						</button>
						<button
							type="button"
							value={index}
							class="action"
							disabled={order.status !== 'pending'}
							aria-disabled={order.status === 'pending'}
							on:click|stopPropagation={onMarkAsRejected}>
							<Icon src={XMark} class="w-5 h-5" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	.action {
		@apply p-2 rounded-lg text-gray-700 flex items-center hover:bg-gray-200 disabled:hover:bg-transparent disabled:text-gray-200;
	}
</style>
