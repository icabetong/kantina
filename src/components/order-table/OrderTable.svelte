<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { Banknotes, Cake, XMark } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import ConfirmModal from '$components/modals/confirm-modal/ConfirmModal.svelte'
	import { getCurrencyFormatter, getDateTimeFormatter } from '$shared/formatter'
	import { getFullName } from '$shared/user'

	const dispatch = createEventDispatcher<TableEvent<Order>>()

	const currencyFormatter = getCurrencyFormatter()
	const dateFormatter = getDateTimeFormatter()
	export let orders: Order[] = []
	export let showId: boolean = false

	const onHandleSelect = (order: Order) => dispatch('select', order)

	const onMarkAsStarted = (event: Event) => {
		try {
			const target = event.target as HTMLButtonElement
			const index: number = target.value ? parseInt(target.value) : -1

			if (index < 0) return
			const order = orders[index]

			openModal(ConfirmModal, {
				title: 'Mark As Started',
				message:
					"Do you want to mark this order as paid? For everyone's security, this action cannot be undone.",
				confirmText: 'Continue',
				abandonText: 'Cancel',
				confirm: async () => {
					await fetch(`/api/order/${order.id}`, {
						method: 'PATCH',
						body: JSON.stringify({ product: { status: 'started' } })
					})
					toast.push('Order marked as Started')

					goto($page.url, { replaceState: true })
				}
			})
		} catch (e) {
			if (e instanceof Error) toast.push(e.message)
			else toast.push('An Error Occurred')
		}
	}
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

<div class="relative mb-4 flex-1 overflow-x-auto rounded-lg border border-gray-100">
	<table class="w-full text-left text-sm text-gray-500">
		<thead class="border-b border-gray-100 text-xs uppercase text-gray-700">
			<tr>
				{#if showId}
					<th scope="col" class="rounded-l-lg py-3 px-6">
						<span>Order ID</span>
					</th>
				{/if}
				<th scope="col" class="py-3 px-4"> Customer </th>
				<th scope="col" class="py-3 px-4"> Status </th>
				<th scope="col" class="py-3 px-4">Total Payment</th>
				<th scope="col" class="py-3 px-4"> Created </th>

				<th scope="col" class="rounded-r-lg py-3 px-4">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y-gray-100 divide-y">
			{#each orders as order, index}
				<tr
					class="cursor-pointer rounded-lg bg-white hover:bg-gray-50"
					on:click={() => onHandleSelect(order)}>
					{#if showId}
						<td class="px-4">{order.id}</td>
					{/if}
					<th scope="row" class="whitespace-nowrap py-2 px-4 font-medium text-gray-800">
						{order.expand && getFullName(order.expand?.customer)}
						<p class="text-xs font-normal text-gray-500">
							{order.expand && order.expand.customer.email}
						</p>
					</th>
					<td class="px-4 py-2 font-medium">
						{#if order.status === 'complete'}
							<span class="badge-green capitalize">{order.status}</span>
						{:else if order.status === 'paid'}
							<span class="badge-blue capitalize">{order.status}</span>
						{:else if order.status === 'pending' || order.status === 'started'}
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
					<td class="flex items-center justify-center px-4 py-2">
						<button
							type="button"
							value={index}
							class="action"
							disabled={order.status === 'pending'}
							on:click|stopPropagation={onMarkAsStarted}>
							<Icon src={Cake} class="h-5 w-5" />
						</button>
						<button
							type="button"
							value={index}
							class="action"
							disabled={order.status !== 'pending'}
							aria-disabled={order.status === 'pending'}
							on:click|stopPropagation={onMarkAsPaid}>
							<Icon src={Banknotes} class="h-5 w-5" />
						</button>
						<button
							type="button"
							value={index}
							class="action"
							disabled={order.status !== 'pending'}
							aria-disabled={order.status === 'pending'}
							on:click|stopPropagation={onMarkAsRejected}>
							<Icon src={XMark} class="h-5 w-5" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	.action {
		@apply flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-200 disabled:text-gray-200 disabled:hover:bg-transparent;
	}
</style>
