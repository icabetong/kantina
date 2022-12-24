<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$components/button/Button.svelte'
	import { authenticate } from '$lib/auth'
	import { createForm } from 'svelte-forms-lib'
	import pocketbase from '$lib/backend'

	let isWorking: boolean = false
	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: async (data) => {
			isWorking = true
			await authenticate(data.email, data.password)
		}
	})

	pocketbase.authStore.onChange(() => {
		if (pocketbase.authStore.isValid) goto('/')
	})
</script>

<div class="page w-full h-full flex flex-col items-center justify-center">
	<form class="mx-auto form-root" on:submit|preventDefault={handleSubmit}>
		<div class="flex flex-col items-start">
			<h1 class="text-2xl font-semibold mb-8">Login to your Kantina Account</h1>
			<div class="form-control-group">
				<label for="email" class="form-control-label"> Email </label>
				<input
					required
					type="email"
					id="email"
					class="form-control-input"
					placeholder="name@kantina.com"
					aria-required="true"
					disabled={isWorking}
					on:change={handleChange}
					bind:value={$form.email} />
			</div>
			<div class="form-control-group">
				<label for="password" class="form-control-label"> Password </label>
				<input
					required
					type="password"
					id="password"
					class="form-control-input"
					placeholder="••••••••••"
					aria-required="true"
					disabled={isWorking}
					on:change={handleChange}
					bind:value={$form.password} />
			</div>
			<div class="flex flex-row mt-4 mb-2 gap-2">
				<Button type="submit" isLoading={isWorking}>Login</Button>
				<button
					type="button"
					disabled={isWorking}
					class="btn-outlined"
					on:click={() => goto('/register')}>
					Register
				</button>
			</div>
			<button
				type="button"
				class="link text-sm"
				disabled={isWorking}
				on:click={() => goto('/forgot-password')}>
				Forgot Password?
			</button>
		</div>
	</form>
</div>

<svelte:head>
	<title>Login to Kantina</title>
</svelte:head>
