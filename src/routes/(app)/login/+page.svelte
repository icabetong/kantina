<script lang="ts">
	import { ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'

	let error: string | null = null
	let isWorking = false

	const onAuthenticate = () => {
		return async ({ result }: { result: ActionResult }) => {
			pocketbase.authStore.loadFromCookie(document.cookie)
			await applyAction(result)
		}
	}
</script>

<div class="hero">
	<div class="page w-full min-h-screen flex flex-col items-center justify-center">
		<form class="mx-auto max-w-md form-root" method="POST" use:enhance={onAuthenticate}>
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
						name="email"
						id="email"
						class="form-control-input"
						placeholder="name@kantina.com"
						aria-required="true" />
				</div>
				<div class="form-control-group">
					<label for="password" class="form-control-label"> Password </label>
					<input
						required
						type="password"
						name="password"
						id="password"
						class="form-control-input"
						placeholder="••••••••••"
						aria-required="true" />
				</div>
				<div class="w-full flex flex-col items-center justify-between mt-4 mb-2 gap-2 md:flex-row">
					<div class="flex flex-col gap-4 w-full md:flex-row md:gap-2">
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
						class="link text-sm min-w-fit"
						disabled={isWorking}
						on:click={() => goto('/forgot-password')}>
						Forgot Password?
					</button>
				</div>
			</div>
		</form>
	</div>
</div>

<svelte:head>
	<title>Login to Kantina</title>
</svelte:head>
