import pocketbase from "$lib/backend";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (() => {
  const user = pocketbase.authStore.model
  if (user?.type !== 'merchant')
  throw error(404, 'Unauthorized')

  return {user}
}) satisfies PageLoad ;