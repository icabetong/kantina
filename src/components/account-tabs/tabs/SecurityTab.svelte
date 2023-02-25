<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import pocketbase from '$lib/backend'
	import UserStore from '$stores/user'

	let user = $UserStore
	let signOutButton: HTMLButtonElement
	const { form, handleSubmit, handleChange, isModified } = createForm({
		initialValues: {
			email: ''
		},
		onSubmit: async (data) => {
			await pocketbase.collection('users').requestPasswordReset(data.email)
		}
	})

	const onDisable = async () => {
		if (!user?.id) return
		if (!confirm('Continue account deactivation?')) return

		await pocketbase.collection('users').update(user?.id, { status: 'deactivated' })
		signOutButton.click()
	}
	const onEndSession = () => {
		return async ({ result }: { result: ActionResult }) => {
			pocketbase.authStore.clear()
			await applyAction(result)
		}
	}
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
	<div class="mt-8">
		<h3 class="text-lg font-semibold">Deactivate Account</h3>
		<p class="mb-4 text-gray-500">Temporarily disable your account in Kantina.</p>
		<button type="button" class="btn-primary" on:click={onDisable}>Get Started</button>
	</div>
</section>
<form action="/logout" method="POST" use:enhance={onEndSession} class="hidden">
	<button type="submit" bind:this={signOutButton} />
</form>
