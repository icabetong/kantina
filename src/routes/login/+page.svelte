<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: (formData) => {
			console.log(formData)
		}
	})
</script>

<div class="page w-full h-full flex flex-col items-center justify-center">
	<form class="mx-auto form-root" on:submit|preventDefault={handleSubmit}>
		<div class="flex flex-col items-start">
			<h1 class="text-2xl font-semibold mb-8">Login to your Kantina Account</h1>
			<div class="form-control-group">
				<label for="email" class="form-control-label"> Email </label>
				<input
					type="email"
					id="email"
					class="form-control-input"
					placeholder="name@kantina.com"
					on:change={handleChange}
					bind:value={$form.email}
					required
					aria-required="true"
				/>
			</div>
			<div class="form-control-group">
				<label for="password" class="form-control-label"> Password </label>
				<input
					type="password"
					id="password"
					class="form-control-input"
					placeholder="••••••••••"
					on:change={handleChange}
					bind:value={$form.password}
					required
					aria-required="true"
				/>
			</div>
			<div class="flex flex-row mt-4">
				<button class="btn-primary" type="submit"> Login </button>
				<div class="btn-outlined">
					<a href="/register">Register</a>
				</div>
			</div>
			<span class="link text-sm">
				<a href="/forgot-password">Forgot Password?</a>
			</span>
		</div>
	</form>
</div>

<svelte:head>
	<title>Login to Kantina</title>
</svelte:head>
