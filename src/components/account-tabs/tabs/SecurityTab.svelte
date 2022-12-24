<script lang="ts">
	import pocketbase from '$lib/backend'
	import { createForm } from 'svelte-forms-lib'

	const { form, handleSubmit, handleChange } = createForm({
		initialValues: {
			email: ''
		},
		onSubmit: async (data) => {
			await pocketbase.collection('users').requestPasswordReset(data.email)
		}
	})
</script>

<form class="flex-1 w-full flex flex-col mt-8" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col items-start">
		<div class="w-1/2">
			<h3 class="text-lg font-semibold">Update or Reset Password</h3>
			<p class="text-gray-500 mb-4">
				If your password has been compromised, you can update your password by sending the
				change/link to your email.
			</p>
			<div class="form-control-group">
				<label for="email" class="form-control-label">Email Address:</label>
				<input
					required
					type="email"
					id="email"
					aria-required="true"
					class="form-control-input"
					placeholder="name@example.com"
					on:change={handleChange}
					bind:value={$form.email} />
			</div>
			<button type="submit" class="btn-primary">Continue</button>
		</div>
	</div>
</form>
