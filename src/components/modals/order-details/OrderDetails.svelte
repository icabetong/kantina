<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import Modal from '$components/modals/Modal.svelte'
	import { getCurrencyFormatter, getDateTimeFormatter } from '$shared/formatter'
	import { getFullName } from '$shared/user'

	const dateFormatter = getDateTimeFormatter()
	const currencyFormatter = getCurrencyFormatter()
	export let isOpen: boolean
	export let order: Order
</script>

<Modal {isOpen} title="Order Details">
	<div class="flex justify-center gap-4">
		<div class="flex-auto w-1/2">
			{#if order.expand?.customer}
				<div class="form-control-group">
					<label for="customer" class="form-control-label">Customer</label>
					<input
						readonly
						type="text"
						id="customer"
						class="form-control-input-dense"
						aria-readonly="true"
						value={getFullName(order.expand.customer)} />
				</div>
			{/if}
			<div class="form-control-group">
				<label for="status" class="form-control-label">Status</label>
				<input
					readonly
					type="text"
					id="status"
					value={order.status}
					class="form-control-input-dense uppercase"
					aria-readonly="true" />
			</div>
			{#if order.reference}
				<div class="form-control-group">
					<label for="reference" class="form-control-label">Payment Reference Number:</label>
					<input
						readonly
						type="text"
						id="reference"
						class="form-control-input dense"
						value={order.reference}
						aria-readonly="true" />
				</div>
			{/if}
			<div class="form-control-group">
				<label for="created" class="form-control-label">Order Created</label>
				<input
					readonly
					type="text"
					id="created"
					value={dateFormatter.format(Date.parse(order.created))}
					class="form-control-input-dense"
					aria-readonly="true" />
			</div>
			<div class="form-control-group">
				<label for="total" class="form-control-label">Total Payment</label>
				<input
					readonly
					type="text"
					id="total"
					value={currencyFormatter.format(order.total)}
					class="form-control-input-dense"
					aria-readonly="true" />
			</div>
		</div>
		<div class="flex-auto w-1/2">
			{#if order.expand?.products}
				<h6 class="form-control-label">Products</h6>
				<ul class="h-full">
					{#each order.expand.products as products}
						<li class="text-sm text-gray-600 py-1.5">
							<dl>
								<dt class="font-semibold text-gray-800">{products.name}</dt>
								<dd>
									Quantity:
									<span class="text-gray-800 font-bold">
										{order.quantities[products.id]}
									</span>
								</dd>
							</dl>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<div slot="actions" class="flex flex-row gap-4">
		<button type="button" class="btn-outlined" on:click={closeModal}>Done</button>
	</div>
</Modal>
