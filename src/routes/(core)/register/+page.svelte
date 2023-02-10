<script lang="ts">
	import { ExclamationTriangle } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import pocketbase from '$lib/backend'
	import type { ActionData } from './$types'

	export let form: ActionData
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
	<div class="page flex min-h-screen w-full flex-col items-center justify-center">
		<form class="form-root mx-auto max-w-md" use:enhance={onRegister} method="POST">
			<div class="flex flex-col items-start">
				<h1 class="mb-8 text-2xl font-semibold">Register to Kantina</h1>
				{#if form?.invalid}
					<div class="alert-error">
						<Icon src={ExclamationTriangle} class="mr-3 inline h-5 w-5 flex-shrink-0" />
						<span class="sr-only">Info</span>
						<div>
							<span class="font-medium">{form?.invalid}</span>
						</div>
					</div>
				{/if}
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
					<label for="idNumber" class="form-control-label">ID Number</label>
					<input
						required
						type="text"
						name="idNumber"
						id="idNumber"
						class="form-control-input"
						placeholder="XXXX-XX-XXXX"
						aria-required="true" />
				</div>
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
				<div class="mb-6 flex items-start">
					<div class="flex h-5 items-center">
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
				<div class="mt-4 mb-2 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
					<div class="flex w-full flex-col gap-4 md:flex-row md:gap-2">
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
	<title>Register to Kantina</title>
</svelte:head>
