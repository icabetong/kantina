<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import Modal from '$components/modals/Modal.svelte'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { Folder, XMark, ExclamationTriangle } from '@steeze-ui/heroicons'
	import { createForm } from 'svelte-forms-lib'
	import { closeModal } from 'svelte-modals'
	import UserStore from '$stores/auth'
	import pocketbase from '$lib/backend'
	import { parseFileUrl } from '$lib/files'

	export let isOpen: boolean
	export let store: Store
	export let product: Product | null = null

	let userId = $UserStore?.id
	let isWorking = false
	let error: string | null = null
	let hasRemovedImage: boolean = false
	const { form, handleSubmit } = createForm<Kantina.ProductForm>({
		initialValues: {
			id: product?.id ?? '',
			name: product?.name ?? '',
			description: product?.description,
			price: product?.price ?? 0,
			currentPrice: product?.currentPrice,
			quantity: product?.quantity ?? 0,
			category: product?.category ?? 'food',
			visible: product?.visible ?? true
		},
		onSubmit: async (form) => {
			if (!userId) return

			if (form.quantity < 0) {
				error = 'Invalid product quantity. It needs to be a positive number'
				return
			}
			if (form.price < 0.01) {
				error = 'Invalid price for product'
				return
			}
			if (hasDiscount && form.currentPrice && form.currentPrice < 0.01) {
				error = 'Invalid discounted price for product'
				return
			}

			isWorking = true
			const formData = new FormData()
			Object.keys(form).forEach((key) => {
				// @ts-ignore
				formData.set(key, form[key])
			})

			formData.append('store', store.id)

			if (fileInput.files && fileInput.files?.item(0)) formData.append('image', fileInput.files[0])

			try {
				if (product) {
					if (hasRemovedImage)
						await pocketbase.collection('products').update(form.id, { image: null })

					await pocketbase.collection('products').update(form.id, formData)
				} else await pocketbase.collection('products').create(formData)
				goto($page.url, { replaceState: true, invalidateAll: true })
				closeModal()
			} catch (e: any) {
				console.error(e)
				error = e.message
			} finally {
				isWorking = false
			}
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
	const onRemoveCurrentImage = () => {
		if (product?.image) {
			product.image = null
			hasRemovedImage = true
		} else file = null
	}
</script>

<Modal {isOpen} title="Product Editor" asForm on:submit={handleSubmit}>
	<div>
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
						bind:value={$form.description} />
				</div>
				<div class="form-control-group">
					<label for="price" class="form-control-label">Price</label>
					<input
						required
						type="number"
						id="price"
						min="0"
						class="form-control-input-dense"
						aria-required="true"
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
						min="0"
						class="form-control-input-dense"
						aria-required="true"
						bind:value={$form.quantity} />
				</div>
				<div class="form-control-group">
					<label for="categories" class="form-control-label">Category</label>
					<select
						required
						id="categories"
						class="form-control-dropdown-dense"
						aria-required
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
							class="block relative w-full bg-gray-50 border-gray-300 border-y border-r rounded-r-lg rounded-y-lg py-2 pl-2 pr-8 truncate">
							{#if imageName}
								{imageName}
							{:else if product?.image}
								{product.image}
							{:else}
								<span class="text-gray-500">Browse for image</span>
							{/if}
							{#if file || product?.image}
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
						{:else if product && product?.image}
							<img
								src={parseFileUrl('products', product.id, product.image, '24x24')}
								alt={product.name}
								class="h-24" />
						{:else}
							<div class="bg-gray-100 text-gray-500 rounded-lg px-2 py-1 mt-2 text-center">
								No Image Selected
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		{#if error}
			<div class="alert-error">
				<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
				<span class="font-medium">{error}</span>
			</div>
		{/if}
	</div>

	<div slot="actions" class="flex flex-row gap-4">
		<Button type="submit" isLoading={isWorking} loadingText="Saving">Save</Button>
		<button type="button" class="btn-outlined" on:click={closeModal}>Cancel</button>
	</div>
</Modal>
