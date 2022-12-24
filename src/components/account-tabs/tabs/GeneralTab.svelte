<script lang="ts">
	import UserStore from '$stores/auth'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { User } from '@steeze-ui/heroicons'
	import { createForm } from 'svelte-forms-lib'
	import type { Record } from 'pocketbase'
	import pocketbase from '$lib/backend'
	import { buildFileUrl } from '$lib/files'

	pocketbase.collection('users').confirmEmailChange()
	const user = $UserStore
	const { form, handleSubmit, handleChange } = createForm({
		initialValues: {
			id: user?.id ?? '',
			firstName: user?.firstName ?? '',
			lastName: user?.lastName ?? '',
			email: user?.email ?? '',
			type: user?.type ?? 'customer',
			created: Number.parseInt(user?.created ?? Date.now().toString()),
			updated: Number.parseInt(user?.updated ?? Date.now().toString()),
			username: user?.username ?? ''
		},
		onSubmit: async (data) => {}
	})

	let hasChanged = false
	let avatar: string | ArrayBuffer | null = null
	let fileInput: HTMLInputElement
	const onFileInputTapped = () => fileInput.click()
	const onFileSelected = (event: Event) => {
		if (event && event.target !== null) {
			const target = event.target as HTMLInputElement

			let image = target.files && target.files[0]
			if (!image) return

			let reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (event: ProgressEvent<FileReader>) => {
				avatar = event.target?.result ?? null
				hasChanged = true
			}
		}
	}
	const onUpdateAvatar = async () => {
		if (!fileInput.files) return
		if (!user) return

		const formData = new FormData()
		formData.append('avatar', fileInput.files[0])
		await pocketbase.collection('users').update(user.id, formData)
	}
</script>

<div class="flex flex-col md:flex-row mb-8 gap-8">
	<div class="flex-1 flex flex-col md:flex-row gap-4">
		<div>
			{#if avatar && typeof avatar === 'string'}
				<img src={avatar} alt="avatar" class="w-36 h-36 rounded-full" />
			{:else if user && user?.avatar}
				<img src={buildFileUrl(user, user.avatar)} alt="avatar" class="w-36 h-36 rounded-full" />
			{:else}
				<div class="bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full w-fit p-6">
					<Icon src={User} class="w-24 h-24 rounded-full text-white" />
				</div>
			{/if}
		</div>
		<div class="flex-1 flex flex-col items-start gap-2">
			<button type="button" class="btn-outlined py-2 px-3 text-xs" on:click={onFileInputTapped}>
				Browse
			</button>
			{#if hasChanged}
				<button type="button" class="btn-primary" on:click={onUpdateAvatar}>Save</button>
			{/if}
		</div>
	</div>
	<div class="flex-1">
		<input
			type="file"
			id="avatar"
			accept="image/*"
			class="hidden"
			on:change={onFileSelected}
			bind:this={fileInput} />
	</div>
</div>
<form class="flex-1 w-full flex flex-col mt-8" on:submit|preventDefault={handleSubmit}>
	<div class="h-full w-full flex flex-col md:flex-row items-start gap-8">
		<div class="flex-1 w-full h-full">
			<div class="form-control-group">
				<label for="firstName" class="form-control-label">First Name</label>
				<input
					type="text"
					id="firstName"
					class="form-control-input"
					on:change={handleChange}
					bind:value={$form['firstName']} />
			</div>
			<div class="form-control-group">
				<label for="lastName" class="form-control-label">Last Name</label>
				<input
					type="text"
					id="lastName"
					class="form-control-input"
					on:change={handleChange}
					bind:value={$form['lastName']} />
			</div>
			<div class="form-control-group">
				<label for="email" class="form-control-label">Email</label>
				<input
					type="email"
					id="email"
					class="form-control-input"
					on:change={handleChange}
					bind:value={$form['email']} />
			</div>
		</div>
		<div class="flex-1 w-full h-full">
			<div class="form-control-group">
				<label for="userId" class="form-control-label">Account ID</label>
				<input
					disabled
					type="text"
					id="userId"
					class="form-control-input"
					aria-disabled="true"
					on:change={handleChange}
					bind:value={$form['id']} />
			</div>
			<div class="form-control">
				<label for="username" class="form-control-label">Username</label>
				<input
					disabled
					type="text"
					id="username"
					class="form-control-input"
					aria-disabled="true"
					on:change={handleChange}
					bind:value={$form['username']} />
			</div>
		</div>
	</div>
	<button class="btn-primary w-fit self-end px-8" type="submit">Save</button>
</form>
