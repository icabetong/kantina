<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import { authenticate } from '$lib/auth'
	import pocketbase from '$lib/backend'
	import { createForm } from 'svelte-forms-lib'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { ExclamationTriangle } from '@steeze-ui/heroicons'

	let accountType = 'consumer'
	if ($page.url.searchParams.has('type'))
		accountType = $page.url.searchParams.get('type') ?? 'consumer'

	let error: string | null = null
	let isWorking: boolean = false
	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			type: accountType
		},
		onSubmit: async (data) => {
			isWorking = true
			try {
				const { email, password, ...other } = data
				await authenticate(email, password, true, other)
			} catch (ignored) {
				error = 'An error occured while creating your account.'
			} finally {
				isWorking = false
			}
		}
	})

	pocketbase.authStore.onChange(() => {
		if (pocketbase.authStore.isValid) goto('/')
	})
</script>

<div class="hero">
	<div class="page w-full min-h-screen flex flex-col items-center justify-center">
		<form class="mx-auto form-root" on:submit|preventDefault={handleSubmit}>
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
						id="firstName"
						class="form-control-input"
						placeholder="Joachim"
						aria-required="true"
						on:change={handleChange}
						bind:value={$form.firstName} />
				</div>
				<div class="form-control-group">
					<label for="lastName" class="form-control-label"> Last Name </label>
					<input
						required
						type="text"
						id="lastName"
						class="form-control-input"
						placeholder="von Ribbentrop"
						aria-required="true"
						on:change={handleChange}
						bind:value={$form.lastName} />
				</div>
				<div class="form-control-group">
					<label for="email" class="form-control-label"> Email </label>
					<input
						required
						type="email"
						id="email"
						class="form-control-input"
						placeholder="name@kantina.com"
						aria-required="true"
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
						on:change={handleChange}
						bind:value={$form.password} />
				</div>
				<div class="form-control-group">
					<label for="type" class="form-control-label">Account Type</label>
					<select
						required
						id="type"
						class="form-control-dropdown"
						aria-required="true"
						aria-describedby="helper-text-explanation"
						on:change={handleChange}
						bind:value={$form.type}>
						<option selected>Select one</option>
						<option value="customer">Customer</option>
						<option value="merchant">Merchant</option>
					</select>
					<p id="helper-text-explanation" class="form-control-info">
						A <span class="font-semibold">merchant</span> account has the ability to sell goods, if
						you are a student or faculty member, select <span class="font-semibold">Customer</span>
					</p>
				</div>
				<div class="flex flex-row mt-4 mb-2 gap-2">
					<Button type="submit" isLoading={isWorking}>Register</Button>
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
	<title>Register to Kantina</title>
</svelte:head>
