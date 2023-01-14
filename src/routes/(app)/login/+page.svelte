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
	<div class="page flex min-h-screen w-full flex-col items-center justify-center">
		<form class="form-root mx-auto max-w-md" method="POST" use:enhance={onAuthenticate}>
			<div class="flex flex-col items-start">
				<h1 class="mb-8 text-2xl font-semibold">Login to your Kantina Account</h1>
				{#if error}
					<div class="alert-error">
						<Icon src={ExclamationTriangle} class="mr-3 inline h-5 w-5 flex-shrink-0" />
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
				<div class="mt-4 mb-2 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
					<div class="flex w-full flex-col gap-4 md:flex-row md:gap-2">
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
						class="link min-w-fit text-sm"
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
