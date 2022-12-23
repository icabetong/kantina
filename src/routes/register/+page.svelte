<script lang="ts">
	import { createForm } from 'svelte-forms-lib'
	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: ''
		},
		onSubmit: (formData) => {
			console.log(formData)
		}
	})
</script>

<div class="page w-full h-full flex flex-col items-center justify-center">
	<form class="mx-auto form-root">
		<div class="flex flex-col items-start">
			<h1 class="text-2xl font-semibold mb-8">Register to Kantina</h1>
			<div class="form-control-group">
				<label for="firstName" class="form-control-label"> First Name </label>
				<input
					type="text"
					id="firstName"
					class="form-control-input"
					placeholder="Joachim"
					on:change={handleChange}
					bind:value={$form.firstName} />
			</div>
			<div class="form-control-group">
				<label for="lastName" class="form-control-label"> Last Name </label>
				<input
					type="text"
					id="lastName"
					class="form-control-input"
					placeholder="von Ribbentrop"
					on:change={handleChange}
					bind:value={$form.lastName} />
			</div>
			<div class="form-control-group">
				<label for="email" class="form-control-label"> Email </label>
				<input
					type="email"
					id="email"
					class="form-control-input"
					placeholder="name@kantina.com"
					on:change={handleChange}
					bind:value={$form.email} />
			</div>
			<div class="form-control-group">
				<label for="password" class="form-control-label"> Password </label>
				<input
					type="password"
					id="password"
					class="form-control-input"
					placeholder="••••••••••"
					on:change={handleChange}
					bind:value={$form.password} />
			</div>
			<div class="flex flex-row mt-4 mb-2 gap-2">
				<button class="btn-primary" type="submit"> Register </button>
				<div class="btn-outlined">
					<a href="/login">Login</a>
				</div>
			</div>
			<span class="link text-sm">
				<a href="/forgot-password">Forgot Password?</a>
			</span>
		</div>
	</form>
</div>

<svelte:head>
	<title>Register to Kantina</title>
</svelte:head>
