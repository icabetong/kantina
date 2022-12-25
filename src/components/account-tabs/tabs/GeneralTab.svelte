<script lang="ts">
	import Button from '$components/button/Button.svelte'
	import UserStore from '$stores/auth'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { User, ExclamationTriangle } from '@steeze-ui/heroicons'
	import { createForm } from 'svelte-forms-lib'
	import type { Record } from 'pocketbase'
	import pocketbase from '$lib/backend'
	import { buildFileUrl } from '$lib/files'

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

	let upgradeIsPending = false
	let upgradeError: string | null = null
	const onUpdateToMerchant = async () => {
		if (!user) {
			upgradeError = 'An error occured. Could not authenticate connection'
			return
		}
		upgradeIsPending = true

		try {
			await pocketbase.collection('users').update(user.id, { type: 'merchant' })
		} catch (error: any) {
			if ('message' in error) upgradeError = error.message
			else upgradeError = error
		} finally {
			upgradeIsPending = false
		}
	}
</script>

<section id="avatar-settings" class="flex flex-col md:flex-row mb-8 gap-8">
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
		<div class="flex-1 flex flex-col-reverse items-start gap-2">
			<button
				type="button"
				class="btn-outlined py-2 px-3 w-20 text-xs"
				on:click={onFileInputTapped}>
				Browse
			</button>
			{#if hasChanged}
				<button type="button" class="btn-primary py-2 px-3 w-20 text-xs" on:click={onUpdateAvatar}>
					Save
				</button>
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
</section>
<section id="information">
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
						type="text"
						id="username"
						class="form-control-input"
						on:change={handleChange}
						bind:value={$form['username']} />
				</div>
			</div>
		</div>
		<button class="btn-primary w-fit self-end px-8" type="submit">Save</button>
	</form>
</section>
{#if user?.type === 'customer'}
	<section id="upgrade-to-merchant" class="mt-12 w-1/2">
		<h3 class="font-semibold text-xl text-orange-500">Upgrade to Merchant Account</h3>
		<p class="mt-1 mb-4 text-gray-500 text-md">
			Upgrading to Merchant account enables selling to Kantina. However you need to be a valid stall
			owner or vendor to continue. Contact the administration for further details.
		</p>
		<div class="alert-error">
			<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
			<span class="sr-only">Error</span>
			<div>
				<span class="font-medium">{upgradeError}</span>
			</div>
		</div>
		<Button isLoading={upgradeIsPending} on:click={onUpdateToMerchant}>Upgrade</Button>
	</section>
{/if}
