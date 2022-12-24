<script lang="ts">
	import Modal from '$components/modals/Modal.svelte'
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'

	export let isOpen: boolean
	export let product: App.ProductRecord | null = null
	const { form, handleSubmit, handleChange } = createForm<App.ProductRecord>({
		initialValues: {
			id: product?.id ?? '',
			name: product?.name ?? '',
			price: product?.price ?? 0,
			quantity: product?.quantity ?? 0,
			category: product?.category ?? 'food',
			created: product?.created ?? Date.now(),
			updated: product?.updated ?? Date.now(),
			visible: product?.visible ?? true
		},
		onSubmit: async (data) => {
			console.log(data)
		}
	})

	let hasDiscount: boolean = false
</script>

<Modal {isOpen} title="Product Editor" asForm onSubmit={handleSubmit}>
	<div class="flex flex-row items-start gap-4">
		<div class="flex-1">
			<div class="form-control-group">
				<label for="name" class="form-control-label">Name</label>
				<input
					required
					type="text"
					id="name"
					class="form-control-input-dense"
					aria-required="true"
					on:change={handleChange}
					bind:value={$form.name} />
			</div>
			<div class="form-control-group">
				<label for="price" class="form-control-label">Price</label>
				<input
					required
					type="number"
					id="price"
					class="form-control-input-dense"
					aria-required="true"
					on:change={handleChange}
					bind:value={$form.price} />
			</div>
			<div class="form-control-group flex flex-row items-center">
				<input
					type="checkbox"
					id="differentPrice"
					class="form-control-checkbox"
					aria-required="true"
					bind:checked={hasDiscount} />
				<label for="differentPrice" class="form-control-checkbox-label">Has discount</label>
			</div>
			{#if hasDiscount}
				<div class="form-control-group">
					<label for="currentPrice" class="form-control-label">Current Price</label>
					<input
						type="number"
						id="currentPrice"
						class="form-control-input-dense"
						on:change={handleChange}
						bind:value={$form.currentPrice} />
				</div>
			{/if}
		</div>
		<div class="flex-1">
			<div class="form-control-group">
				<label for="quantity" class="form-control-label">Quantity</label>
				<input
					required
					type="number"
					id="quantity"
					class="form-control-input-dense"
					aria-required="true"
					on:change={handleChange}
					bind:value={$form.quantity} />
			</div>
			<div class="form-control-group">
				<label for="categories" class="form-control-label">Category</label>
				<select
					required
					id="categories"
					class="form-control-dropdown-dense"
					aria-required
					on:change={handleChange}
					bind:value={$form.category}>
					<option selected>Choose a category</option>
					<option value="food">Food</option>
					<option value="drink">Drink</option>
					<option value="meal">Meal</option>
					<option value="other">Other</option>
				</select>
			</div>
			<div class="form-control-group flex flex-row items-center">
				<input
					type="checkbox"
					id="visible"
					class="form-control-checkbox"
					bind:checked={$form.visible} />
				<label for="visible" class="form-control-checkbox-label">Visible in the Store</label>
			</div>
		</div>
	</div>

	<div slot="actions">
		<button type="submit" class="btn-primary">Save</button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
