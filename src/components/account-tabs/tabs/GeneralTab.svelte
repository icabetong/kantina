<script lang="ts">
	import type { Record } from 'pocketbase'
	import { createForm } from 'svelte-forms-lib'
	import { openModal } from 'svelte-modals'
	import { ExclamationTriangle, User } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$components/button/Button.svelte'
	import CreateStore from '$components/modals/create-store/CreateStore.svelte'
	import UpdateAvatar from '$components/modals/update-avatar/UpdateAvatar.svelte'
	import pocketbase from '$lib/backend'
	import { parseFileUrl } from '$lib/files'
	import UserStore from '$stores/user'

	let user = $UserStore
	let isWorking: boolean = false
	const { form, handleSubmit } = createForm({
		initialValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			type: user?.type ?? 'customer',
			username: user?.username
		},
		onSubmit: async (form) => {
			try {
				if (!user?.id) return

				await pocketbase.collection('users').update(user.id, form)
				goto($page.url, { invalidateAll: true, replaceState: true })
			} catch (e) {
				console.error(e)
			}
		}
	})

	const onChangeToMerchant = () => {
		openModal(CreateStore)
	}

	let changePending = false
	let changeError: string | null = null
	const onChangeToCustomer = async () => {
		if (!user) {
			changeError = 'An error occured. Could not authenticate connection'
			return
		}
		changePending = true

		try {
			await pocketbase.collection('users').update(user.id, { type: 'customer' })

			const store = await pocketbase.collection('stores').getFirstListItem(`owner="${user.id}"`)
			await pocketbase.collection('stores').delete(store.id)

			goto($page.url, { invalidateAll: true, replaceState: true })
		} catch (error: any) {
			if ('message' in error) changeError = error.message
			else changeError = error
		} finally {
			changePending = false
		}
	}

	const onTriggerAvatarChange = () => openModal(UpdateAvatar, { userId: user?.id ?? null })
</script>

<h3 class="text-lg font-semibold">Profile Information</h3>
<section id="account-info">
	<form class="flex flex-col items-center" on:submit|preventDefault={handleSubmit}>
		<div class="w-full flex items-center gap-8">
			<div>
				<button type="button" on:click={onTriggerAvatarChange}>
					{#if user && user?.avatar}
						<img
							src={parseFileUrl('users', user.id, user.avatar)}
							alt="avatar"
							class="w-36 h-36 rounded-full" />
					{:else}
						<div class="bg-gradient-to-br from-orange-500 to-pink-500 rounded-full w-fit p-6">
							<Icon src={User} class="w-24 h-24 rounded-full text-white" />
						</div>
					{/if}
				</button>
			</div>
			<div class="flex-1">
				<div class="form-control-group">
					<label for="firstName" class="form-control-label">First Name</label>
					<input
						type="text"
						id="firstName"
						class="form-control-input"
						bind:value={$form['firstName']} />
				</div>
				<div class="form-control-group">
					<label for="lastName" class="form-control-label">Last Name</label>
					<input
						type="text"
						id="lastName"
						class="form-control-input"
						bind:value={$form['lastName']} />
				</div>
			</div>
		</div>
		<div class="w-full flex flex-col md:flex-row items-start gap-8">
			<div class="flex-1 w-full">
				<div class="form-control-group">
					<label for="username" class="form-control-label">Username</label>
					<input
						type="text"
						id="username"
						class="form-control-input"
						bind:value={$form['username']} />
				</div>
			</div>
			<div class="flex-1 w-full">
				<div class="form-control-group">
					<label for="email" class="form-control-label">Email</label>
					<input
						disabled
						type="email"
						id="email"
						class="form-control-input"
						aria-disabled="true"
						bind:value={$form['email']} />
				</div>
			</div>
		</div>
		<div class="w-full mt-2 flex justify-end">
			<Button type="submit" isLoading={isWorking}>Save</Button>
		</div>
	</form>
</section>
{#if user?.type === 'customer'}
	<section id="upgrade-to-merchant" class="my-12 w-full md:max-w-screen-sm">
		<h3 class="font-semibold text-lg">Upgrade to Merchant Account</h3>
		<p class="mt-1 mb-4 text-gray-500 text-md">
			Upgrading to Merchant account enables selling to Kantina. However you need to be a valid stall
			owner or vendor to continue. Contact the administration for further details.
		</p>
		{#if changeError}
			<div class="alert-error">
				<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
				<span class="sr-only">Error</span>
				<div>
					<span class="font-medium">{changeError}</span>
				</div>
			</div>
		{/if}
		<button type="button" class="btn-primary" on:click={onChangeToMerchant}>Upgrade</button>
	</section>
{:else}
	<section id="downgrade-to-customer" class="my-12 w-full md:max-w-screen-sm">
		<h3 class="font-semibold text-lg">Downgrade to Customer Account</h3>
		<p class="mt-1 mb-4 text-gray-500 text-md">
			Downgrading to Customer account disables selling to Kantina. This will also delete your store
			and products in the database.
		</p>
		{#if changeError}
			<div class="alert-error">
				<Icon src={ExclamationTriangle} class="flex-shrink-0 inline w-5 h-5 mr-3" />
				<span class="sr-only">Error</span>
				<div>
					<span class="font-medium">{changeError}</span>
				</div>
			</div>
		{/if}
		<Button isLoading={changePending} loadingText="Processing" on:click={onChangeToCustomer}>
			Downgrade
		</Button>
	</section>
{/if}
