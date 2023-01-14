<script lang="ts">
	import { Envelope, InformationCircle, MapPin, Phone } from '@steeze-ui/heroicons'
	import { Icon } from '@steeze-ui/svelte-icon'
	import type { ActionResult } from '@sveltejs/kit'
	import { applyAction, enhance } from '$app/forms'
	import type { ActionData } from './$types'

	export let form: ActionData

	const onSubmit = () => {
		return async ({ result }: { result: ActionResult }) => {
			await applyAction(result)
		}
	}
</script>

<div class="page min-h-screen">
	<h1 class="page-header">Contact Us</h1>
	<div class="my-8 flex flex-col items-center gap-12 md:flex-row md:items-start">
		<div class="h-full w-1/3 rounded-lg border p-4">
			<h2 class="text-lg font-bold">Get in touch</h2>
			<p class="text-sm text-gray-500">
				We love to hear from you. Our friendly team is always here to chat.
			</p>
			<ul class="mt-4">
				<li class="row">
					<div><Icon src={Envelope} class="h-5 w-5" /></div>
					<dl>
						<dt class="row-title">Chat to us</dt>
						<dd class="row-body">Our friendly team is here to help.</dd>
						<div class="row-info">support@kantina.com</div>
					</dl>
				</li>
				<li class="row">
					<div><Icon src={MapPin} class="h-5 w-5" /></div>
					<dl>
						<dt class="row-title">Office</dt>
						<dd class="row-body">Come and say hello on our office HQ.</dd>
						<div class="row-info">100 Ludendorff Ave. Dresden, GER</div>
					</dl>
				</li>
				<li class="row">
					<div><Icon src={Phone} class="h-5 w-5" /></div>
					<dl>
						<dt class="row-title">Phone</dt>
						<dd class="row-body">Monday to Friday from 8am to 5pm.</dd>
						<div class="row-info">+1(555)000-000</div>
					</dl>
				</li>
			</ul>
		</div>
		<div class="w-2/3">
			<h1 class="text-xl font-bold">Send us an inquiry</h1>
			<p class="text-sm text-gray-500">
				You can reach us anytime at
				<a href="mailto:support@kantina.com" class="text-red-600"> support@kantina.com </a>
			</p>
			<form method="POST" class="mt-8 w-2/3" use:enhance={onSubmit}>
				{#if form?.success}
					<div
						class="mb-4 flex items-center rounded-lg bg-blue-100 p-4 text-sm text-blue-700"
						role="alert">
						<Icon src={InformationCircle} class="mr-3 h-5 w-5" />
						Feedback Submitted
					</div>
				{/if}
				<div class="form-control-group">
					<label for="name" class="form-control-label">Name</label>
					<input
						required
						type="text"
						name="name"
						id="name"
						class="form-control-input"
						disabled={form?.success}
						placeholder="Paul von Lettow-Vorbeck"
						aria-required="true"
						aria-disabled={form?.success} />
				</div>
				<div class="form-control-group">
					<label for="email" class="form-control-label">Email</label>
					<input
						required
						type="email"
						name="email"
						id="email"
						class="form-control-input"
						disabled={form?.success}
						placeholder="paul.lettow.vorbeck@example.com"
						aria-required="true"
						aria-disabled={form?.success} />
				</div>
				<div class="form-control-group">
					<label for="phone" class="form-control-label">Phone</label>
					<input
						required
						type="string"
						name="phone"
						id="phone"
						class="form-control-input"
						disabled={form?.success}
						placeholder="+49 (001) 1936 1945"
						aria-required="true"
						aria-disabled={form?.success} />
				</div>
				<div class="form-control-group">
					<label for="description" class="form-control-label">Description</label>
					<textarea
						required
						name="description"
						id="description"
						cols="30"
						rows="4"
						class="form-control-input"
						disabled={form?.success}
						placeholder="How can we help you with?"
						aria-required="true"
						aria-disabled={form?.success} />
				</div>
				<button
					type="submit"
					class="btn-primary mt-2 w-full"
					disabled={form?.success}
					aria-disabled={form?.success}>
					{form?.success ? 'Submitted' : 'Submit'}
				</button>
			</form>
		</div>
	</div>
</div>

<svelte:head>
	<title>Contact Us - Kantina</title>
</svelte:head>

<style lang="postcss">
	.row {
		@apply my-8 flex items-start gap-3;
	}
	.row-title {
		@apply font-semibold;
	}
	.row-body {
		@apply text-sm text-gray-500;
	}
	.row-info {
		@apply mt-2 text-sm font-medium;
	}
</style>
