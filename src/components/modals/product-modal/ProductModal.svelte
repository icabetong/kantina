<script lang="ts">
	import Modal from '$components/modals/Modal.svelte'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { Folder, XMark } from '@steeze-ui/heroicons'
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'

	export let isOpen: boolean
	export let product: App.ProductRecord | null = null
	const { form, handleSubmit, handleChange } = createForm<App.ProductRecord>({
		initialValues: {
			id: product?.id ?? '',
			name: product?.name ?? '',
			description: product?.description ?? '',
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
	let file: string | ArrayBuffer | null = null
	let imageName: string | null = null
	let fileInput: HTMLInputElement

	const onFileSelected = (event: Event) => {
		if (event && event.target !== null) {
			const target = event.target as HTMLInputElement

			let image = target.files && target.files[0]
			if (!image) return

			imageName = image.name
			let reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (event: ProgressEvent<FileReader>) => {
				file = event.target?.result ?? null
			}
		}
	}

	const onBrowseImage = () => fileInput.click()
	const onRemoveCurrentImage = () => (file = null)
</script>

<Modal {isOpen} title="Product Editor" asForm onSubmit={handleSubmit}>
	<div class="flex flex-row items-start gap-4">
		<div class="flex-initial w-1/2">
			<div class="form-control-group">
				<label for="name" class="form-control-label">Name</label>
				<input
					required
					type="text"
					id="name"
					class="form-control-input-dense"
					placeholder="Product Name"
					aria-required="true"
					on:change={handleChange}
					bind:value={$form.name} />
			</div>
			<div class="form-control-group">
				<label for="description" class="form-control-label">Description</label>
				<textarea
					id="description"
					cols="30"
					rows="4"
					class="form-control-input"
					placeholder="Some brief product description"
					on:change={handleChange}
					bind:value={$form.description} />
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
		<div class="flex-initial w-1/2">
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
			<div class="form-control-group">
				<label for="image" class="form-control-label">Image</label>
				<img src="" alt="" />
				<input
					type="file"
					id="image"
					class="hidden"
					accept="image/*"
					on:change={onFileSelected}
					bind:this={fileInput} />
				<div class="flex flex-row text-sm w-full">
					<button
						type="button"
						class="flex flex-row items-center text-white bg-orange-500 px-2 border-y border-l rounded-y-lg rounded-l-lg"
						on:click={onBrowseImage}>
						<Icon src={Folder} class="h-5 w-5" />
						<span class="sr-only">Browse Image</span>
					</button>
					<div
						class="block relative w-full bg-gray-50 border-y border-r rounded-r-lg rounded-y-lg py-2 pl-2 pr-8 truncate">
						{#if imageName}
							{imageName}
						{:else}
							Browse for image
						{/if}
						{#if file}
							<button
								type="button"
								class="absolute top-0 right-0 p-2.5 hover:bg-gray-200"
								on:click={onRemoveCurrentImage}>
								<Icon src={XMark} class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>
				<div class="mt-2">
					<h6 class="text-sm">Preview</h6>
					{#if file && typeof file === 'string'}
						<img src={file} alt="product" class="object-contain h-24" />
					{:else}
						<div class="bg-gray-100 text-gray-500 rounded-lg px-2 py-1 mt-2 text-center">
							No Image Selected
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div slot="actions">
		<button type="submit" class="btn-primary">Save</button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
