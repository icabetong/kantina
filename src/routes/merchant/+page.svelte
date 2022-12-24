<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon'
	import { MagnifyingGlass, Plus } from '@steeze-ui/heroicons'
	import ProductTable from '$components/product-table/ProductTable.svelte'
	import ProductModal from '$components/product-modal/ProductModal.svelte'

	let isOpen = false
	function handleOpen() {
		isOpen = !isOpen
	}
</script>

<div class="page w-full h-full flex flex-col items-center justify-center">
	<div class="w-full flex items-center justify-between mb-6">
		<h2 class="page-header text-start">Merchant Center</h2>
		<button class="btn-primary shadow inline-flex items-center" on:click={handleOpen}>
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
				class="block p-2 pl-10 w-full md:w-80 text-sm text-gray-900 bg-white shadow rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-orange-500"
				placeholder="Search for items" />
		</div>
	</div>
	<div class="flex-1 mt-6 w-full">
		<ProductTable />
	</div>
</div>

<ProductModal {isOpen} />

<svelte:head>
	<title>Merchant Center - Kantina</title>
</svelte:head>
