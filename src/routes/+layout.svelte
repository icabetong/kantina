<script>
	import Navigation from '$components/navigation/Navigation.svelte'
	import '../app.css'
</script>

<Navigation />
<main class="flex-1 px-2 sm:px-4 md:px-8">
	<slot />
</main>
<footer class="p-4 bg-white md:px-6 md:py-8 ">
	<div class="sm:flex sm:items-center sm:justify-between">
		<a href="https://kantina.ph" class="flex items-center mb-4 sm:mb-0">
			<img src="/images/icon.png" class="mr-3 h-8" alt="Kantina Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap "> Kantina </span>
		</a>
		<ul class="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 ">
			<li>
				<a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
			</li>
			<li>
				<a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
			</li>
			<li>
				<a href="#" class="mr-4 hover:underline md:mr-6 ">Licensing</a>
			</li>
			<li>
				<a href="#" class="hover:underline">Contact</a>
			</li>
		</ul>
	</div>
	<hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
	<span class="block text-sm text-gray-500 sm:text-center">
		© 2022
		<a href="https://kantina.ph/" class="hover:underline">Kantina™</a>. All Rights Reserved.
	</span>
</footer>
