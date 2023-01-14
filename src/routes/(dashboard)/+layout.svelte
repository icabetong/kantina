<script lang="ts">
	import { ArrowLeft, Cake, RectangleGroup, ShoppingBag } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { page } from '$app/stores'

	let path: string
	$: {
		path = $page.url.pathname
	}
</script>

<main class="flex bg-white text-gray-800">
	<nav class="h-full border-r border-gray-200 md:w-1/4 xl:w-1/6">
		<div class="m-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
			<a href="/" class="tab-link text-gray-500">
				<Icon src={ArrowLeft} class="h-4 w-4" />
				<span class="hidden md:inline-block">Go Back</span>
			</a>
		</div>
		<div class="px-4 py-2">
			<div class="flex items-center">
				<img src="/images/icon.png" alt="kantina logo" class="mr-2 h-8 w-8" />
				<h1
					class="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
					<span class="hidden md:inline-block">Kantina</span>
				</h1>
			</div>
		</div>

		<ul class="mt-4 text-sm font-medium text-gray-500">
			<li aria-checked={path === '/merchant'} class="tab group">
				<a
					href="/merchant"
					class="tab-link group-aria-checked:bg-gradient-to-br group-aria-checked:from-red-600 group-aria-checked:to-orange-500 group-aria-checked:bg-clip-text group-aria-checked:text-transparent">
					<Icon src={RectangleGroup} class="h-5 w-5 group-aria-checked:text-red-500" />
					<span class="hidden md:inline-block">Dashboard</span>
				</a>
			</li>
			<li aria-checked={path === '/merchant/products'} class="tab group">
				<a
					href="/merchant/products"
					class="tab-link group-aria-checked:bg-gradient-to-br group-aria-checked:from-red-600 group-aria-checked:to-orange-500 group-aria-checked:bg-clip-text group-aria-checked:text-transparent">
					<Icon src={Cake} class="h-5 w-5 group-aria-checked:text-red-500" />
					<span class="hidden md:inline-block">Products</span>
				</a>
			</li>
			<li aria-checked={path === '/merchant/orders'} class="tab group">
				<a
					href="/merchant/orders"
					class="tab-link  group-aria-checked:bg-gradient-to-br group-aria-checked:from-red-600 group-aria-checked:to-orange-500 group-aria-checked:bg-clip-text group-aria-checked:text-transparent">
					<Icon src={ShoppingBag} class="h-5 w-5 group-aria-checked:text-red-500" />
					<span class="hidden md:inline-block">Orders</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="md:w-3/4">
		<slot />
	</div>
</main>

<style lang="postcss">
	.tab {
		@apply m-2 rounded-lg hover:bg-red-50 hover:text-red-400 aria-checked:bg-gradient-to-br aria-checked:from-red-100 aria-checked:to-orange-100 aria-checked:text-red-500;
	}
	.tab-link {
		@apply flex items-center gap-3 px-4 py-2.5;
	}
</style>
