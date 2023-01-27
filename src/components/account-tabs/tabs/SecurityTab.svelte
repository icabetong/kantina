<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import pocketbase from '$lib/backend'

	const { form, handleSubmit, handleChange, isModified } = createForm({
		initialValues: {
			email: ''
		},
		onSubmit: async (data) => {
			await pocketbase.collection('users').requestPasswordReset(data.email)
		}
	})
</script>

<section id="update-password" class="w-full md:max-w-screen-sm">
	<form class="flex w-full flex-1 flex-col" on:submit|preventDefault={handleSubmit}>
		<div class="flex flex-col items-start">
			<h3 class="text-lg font-semibold">Update or Reset Password</h3>
			<p class="mb-4 text-gray-500">
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
			{#if $isModified}
				<button type="submit" class="btn-primary">Continue</button>
			{/if}
		</div>
	</form>
</section>
