<script lang="ts">
	import { openModal } from 'svelte-modals'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, Plus } from '@steeze-ui/heroicons'
	import ProductTable from '$components/product-table/ProductTable.svelte'
	import ProductModal from '$components/modals/product-modal/ProductModal.svelte'

	const onTriggerAdd = () => openModal(ProductModal)
	const onTriggerEdit = (product: App.ProductRecord) => {
		openModal(ProductModal, {
			product
		})
	}
	const onTriggerRemove = (product: App.ProductRecord) => {}
</script>

<div class="page w-full h-full flex flex-col items-center justify-center">
	<div class="w-full flex items-center justify-between mb-6">
		<h2 class="page-header text-start">Merchant Center</h2>
		<button
			class="btn-primary shadow inline-flex items-center transition-all"
			on:click={onTriggerAdd}>
			<Icon src={Plus} class="w-5 h-5 mr-2 -ml-1" />
			Add Product
		</button>
	</div>
	<div class="w-full flex justify-end">
		<label for="table-search" class="sr-only">Search</label>
		<div class="relative w-full md:w-fit">
			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
				<Icon src={MagnifyingGlass} class="w-5 h-5" />
			</div>
			<input
				type="text"
				id="table-search"
				class="block p-2 pl-10 w-full md:w-80 text-sm text-gray-800 bg-white shadow rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-orange-500"
				placeholder="Search for items" />
		</div>
	</div>
	<div class="flex-1 mt-6 w-full">
		<ProductTable onProductClick={onTriggerEdit} onProductRemove={onTriggerRemove} />
	</div>
</div>

<svelte:head>
	<title>Merchant Center - Kantina</title>
</svelte:head>
