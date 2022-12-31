<script lang="ts">
	import { ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'

	let accountType = 'consumer'
	if ($page.url.searchParams.has('type'))
		accountType = $page.url.searchParams.get('type') ?? 'consumer'

	let hasAgreed = false
	let error: string | null = null
	let isWorking: boolean = false

	const onRegister = () => {
		return async ({ result }: { result: ActionResult }) => {
			pocketbase.authStore.loadFromCookie(document.cookie)
			await applyAction(result)
		}
	}
</script>

<div class="hero">
	<div class="page w-full min-h-screen flex flex-col items-center justify-center">
		<form class="mx-auto max-w-md form-root" use:enhance={onRegister} method="POST">
			<div class="flex flex-col items-start">
				<h1 class="text-2xl font-semibold mb-8">Register to Kantina</h1>
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
					<label for="firstName" class="form-control-label"> First Name </label>
					<input
						required
						type="text"
						name="firstName"
						id="firstName"
						class="form-control-input"
						placeholder="Joachim"
						aria-required="true" />
				</div>
				<div class="form-control-group">
					<label for="lastName" class="form-control-label"> Last Name </label>
					<input
						required
						type="text"
						name="lastName"
						id="lastName"
						class="form-control-input"
						placeholder="von Ribbentrop"
						aria-required="true" />
				</div>
				<div class="form-control-group">
					<label for="email" class="form-control-label"> Email </label>
					<input
						required
						type="email"
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
				<div class="form-control-group">
					<label for="type" class="form-control-label">Account Type</label>
					<select
						required
						name="type"
						id="type"
						class="form-control-dropdown"
						aria-required="true"
						aria-describedby="helper-text-explanation">
						<option selected>Select one</option>
						<option value="customer">Customer</option>
						<option value="merchant">Merchant</option>
					</select>
					<p id="helper-text-explanation" class="form-control-info">
						A <span class="font-semibold">merchant</span> account has the ability to sell goods, if
						you are a student or faculty member, select
						<span class="font-semibold">Customer</span>
					</p>
				</div>
				<div class="flex items-start mb-6">
					<div class="flex items-center h-5">
						<input
							id="terms"
							type="checkbox"
							class="form-control-checkbox"
							bind:checked={hasAgreed} />
					</div>
					<label for="terms" class="ml-2 text-sm font-medium text-gray-800">
						I agree with the
						<a href="/terms" class="text-orange-700 hover:underline"> terms and conditions </a>
					</label>
				</div>
				<div class="w-full flex flex-col items-center justify-between mt-4 mb-2 gap-2 md:flex-row">
					<div class="flex flex-col gap-4 w-full md:flex-row md:gap-2">
						<Button type="submit" isLoading={isWorking} disabled={!hasAgreed}>Register</Button>
						<button
							type="button"
							class="btn-outlined"
							disabled={isWorking}
							on:click={() => goto('/login')}>
							<a href="/login">Login</a>
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
	<title>Register to Kantina</title>
</svelte:head>
