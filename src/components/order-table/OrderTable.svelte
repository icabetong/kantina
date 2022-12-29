<script lang="ts">
	export let orders: Order[] = []
</script>

<div class="overflow-x-auto relative">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs uppercase bg-gray-100 text-gray-700">
			<tr>
				<th scope="col" class="py-3 px-6 rounded-l-lg">
					<span>Order ID</span>
				</th>
				<th scope="col" class="py-3 px-6"> Customer </th>
				<th scope="col" class="py-3 px-6"> Status </th>
				<th scope="col" class="py-3 px-6"> Created </th>
				<th scope="col" class="py-3 px-6 rounded-r-lg">Actions</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-y-gray-100">
			{#each orders as order}
				<tr class="bg-white hover:bg-gray-50 rounded-lg cursor-pointer">
					<td class="p-2">{order.id}</td>
					<th scope="row" class="py-2 px-6 font-medium text-gray-800 whitespace-nowrap">
						{order.expand?.customer.lastName}
					</th>
					<td class="p-4 font-medium">
						{order.status}
					</td>
					<td>
						{order.created}
					</td>
					<td><button>Remove</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
