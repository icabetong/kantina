<script lang="ts">
	import { onMount } from 'svelte'
	import { openModal } from 'svelte-modals'
	import { toast } from '@zerodevx/svelte-toast'
	import Button from '$components/button/Button.svelte'
	import ScanQrCode from '$components/modals/scan-qr-code/ScanQRCode.svelte'
	import { parseFileUrl } from '$lib/files'
	import { getColor100, getTextColor800 } from '$shared/color'
	import { getCurrencyFormatter } from '$shared/formatter'
	import UserStore from '$stores/user'

	const user = $UserStore
	const formatter = getCurrencyFormatter()
	export let store: Store | null
	export let basket: CartItem[]

	let isSubmitted = false
	let isWorking = false
	let total = 0
	onMount(() => {
		total = basket.reduce((curr, next) => {
			return curr + (next.quantity + (next?.expand?.product.price ?? 0))
		}, 0)
	})

	const onTriggerScanQr = () => openModal(ScanQrCode, { store, onDone })
	const onDone = async () => {
		try {
			isWorking = true
			if (!user?.id) return
			if (!store?.id) return

			const quantities: { [key: string]: number } = {}
			basket.forEach((cartItem) => {
				quantities[cartItem.product] = cartItem.quantity
			})

			const order = {
				customer: user.id,
				store: store.id,
				products: basket.map((item) => item.product),
				status: 'pending',
				quantities: quantities,
				total: total
			}

			await fetch('/api/checkout', {
				method: 'POST',
				body: JSON.stringify({
					order,
					cart: basket,
					products: quantities
				}),
				headers: {
					'content-type': 'application/json'
				}
			})

			toast.push('Order Submitted')
			isSubmitted = true
		} catch (e) {
			if (e instanceof Error) toast.push(e.message)
		} finally {
			isWorking = false
		}
	}
</script>

{#if store && store.image}
	<div class="flex gap-4">
		<div class="w-3/4 flex-1">
			<h6
				class={`mb-2 rounded-lg px-4 py-2 text-sm font-semibold uppercase ${getColor100(
					store.color
				)} ${getTextColor800(store.color)}`}>
				{store?.name}
			</h6>
			<ul class="rounded-lg border border-gray-100 p-2">
				{#each basket as cartItem}
					{#if cartItem.expand?.product && cartItem.expand?.product.image}
						<li class="flex w-full items-center">
							<div>
								<img
									src={parseFileUrl('products', cartItem.product, cartItem.expand.product.image)}
									alt={cartItem.expand.product.name}
									class="h-24" />
							</div>
							<dl class="w-full flex-1 text-sm text-gray-500">
								<dt class="text-lg font-bold text-gray-800">{cartItem.expand?.product.name}</dt>
								<dd class="divide-x-gray-200 flex w-full items-center gap-2 divide-x">
									<div class="font-light">Qty: {cartItem.quantity}</div>
									<div class="pl-2 font-medium">
										{formatter.format(cartItem.expand?.product.price)}
									</div>
								</dd>
							</dl>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<div
			class="relative flex w-1/4 flex-col flex-wrap items-center rounded-lg border border-gray-100 p-4">
			<h6 class="mb-4 self-start font-medium">Payment Information</h6>
			<dl class="row">
				<dt class="row-title">Subtotal:</dt>
				<dd class="row-value">{formatter.format(total)}</dd>
			</dl>
			<dl class="row">
				<dt class="row-title">Discount:</dt>
				<dd class="row-value">{formatter.format(0)}</dd>
			</dl>
			<dl class="row">
				<dt class="row-title">Total:</dt>
				<dd class="row-value">{formatter.format(total)}</dd>
			</dl>
			<div class="mt-4">
				<Button on:click={onTriggerScanQr} isLoading={isWorking} disabled={isSubmitted}>
					{#if isSubmitted}
						Order Placed
					{:else}
						Pay Now
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.row {
		@apply mt-4 flex w-full items-center justify-between;
	}
	.row-title {
		@apply text-xs uppercase text-gray-500;
	}
	.row-value {
		@apply text-base font-semibold;
	}
</style>
