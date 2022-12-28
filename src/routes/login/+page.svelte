<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$components/button/Button.svelte'
	import { authenticate } from '$lib/auth'
	import { createForm } from 'svelte-forms-lib'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ExclamationTriangle } from '@steeze-ui/heroicons'

	let error: string | null = null
	let isWorking: boolean = false
	const { form, handleSubmit } = createForm<Credentials>({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: async (data) => {
			isWorking = true
			try {
				await authenticate(data.email, data.password)

				goto('/')
			} catch (ignored) {
				error = 'The email or password is incorrect'
			} finally {
				isWorking = false
			}
		}
	})
</script>

<div class="hero">
	<div class="page w-full min-h-screen flex flex-col items-center justify-center">
		<form class="mx-auto max-w-md form-root" on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-col items-start">
				<h1 class="text-2xl font-semibold mb-8">Login to your Kantina Account</h1>
				{#if error}
					<div class="alert-error">
						<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
						<span class="sr-only">Info</span>
						<div>
							<span class="font-medium">{error}</span>
						</div>
					</div>
				{/if}
				<div class="form-control-group">
					<label for="email" class="form-control-label"> Username or Email </label>
					<input
						required
						type="text"
						id="email"
						class="form-control-input"
						placeholder="name@kantina.com"
						aria-required="true"
						disabled={isWorking}
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
</div>

<svelte:head>
	<title>Login to Kantina</title>
</svelte:head>
