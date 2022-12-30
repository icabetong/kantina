import pocketbase from "$lib/backend";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (() => {
  const user = pocketbase.authStore.model
	const isValid = pocketbase.authStore.isValid

  if (!isValid && !user) throw redirect(303, '/')
}) satisfies PageLoad