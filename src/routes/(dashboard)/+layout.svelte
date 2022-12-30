<script lang="ts">
	import { ArrowLeft, Cake, RectangleGroup, ShoppingBag } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { page } from '$app/stores'

	let path: string
	$: {
		path = $page.url.pathname
	}
</script>

<main class="bg-white text-gray-800 flex">
	<nav class="h-full border-r border-gray-200 md:w-1/4 xl:w-1/6">
		<div class="text-sm font-semibold m-2 rounded-lg hover:bg-gray-100">
			<a href="/" class="tab-link text-gray-500">
				<Icon src={ArrowLeft} class="w-4 h-4" />
				<span class="hidden md:inline-block">Go Back</span>
			</a>
		</div>
		<div class="px-4 py-2">
			<div class="flex items-center">
				<img src="/images/icon.png" alt="kantina logo" class="w-8 h-8 mr-2" />
				<h1
					class="text-transparent bg-clip-text bg-gradient-to-br to-pink-500 from-orange-500 font-bold text-2xl">
					<span class="hidden md:inline-block">Kantina</span>
				</h1>
			</div>
		</div>

		<ul class="font-medium text-sm text-gray-500 mt-4">
			<li aria-checked={path === '/merchant'} class="tab group">
				<a
					href="/merchant"
					class="tab-link group-aria-checked:text-transparent group-aria-checked:bg-clip-text group-aria-checked:bg-gradient-to-br group-aria-checked:to-pink-500 group-aria-checked:from-orange-500">
					<Icon src={RectangleGroup} class="w-5 h-5 group-aria-checked:text-orange-500" />
					<span class="hidden md:inline-block">Dashboard</span>
				</a>
			</li>
			<li aria-checked={path === '/merchant/products'} class="tab group">
				<a
					href="/merchant/products"
					class="tab-link group-aria-checked:text-transparent group-aria-checked:bg-clip-text group-aria-checked:bg-gradient-to-br group-aria-checked:to-pink-500 group-aria-checked:from-orange-500">
					<Icon src={Cake} class="h-5 w-5 group-aria-checked:text-orange-500" />
					<span class="hidden md:inline-block">Products</span>
				</a>
			</li>
			<li aria-checked={path === '/merchant/orders'} class="tab group">
				<a
					href="/merchant/orders"
					class="tab-link  group-aria-checked:text-transparent group-aria-checked:bg-clip-text group-aria-checked:bg-gradient-to-br group-aria-checked:to-pink-500 group-aria-checked:from-orange-500">
					<Icon src={ShoppingBag} class="w-5 h-5 group-aria-checked:text-orange-500" />
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
		@apply m-2 rounded-lg hover:bg-orange-50 hover:text-orange-400 aria-checked:bg-gradient-to-br aria-checked:to-pink-100 aria-checked:from-orange-100 aria-checked:text-orange-500;
	}
	.tab-link {
		@apply flex items-center gap-3 px-4 py-2.5;
	}
</style>
