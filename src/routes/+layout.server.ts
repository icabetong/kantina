import { authRoutes, privateRoutes } from "$shared/routes";
import UserStore from "$stores/user";
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
  const pathname = url.pathname

  if (locals.user) {
    if (authRoutes.includes(pathname)) {
      throw redirect(303, '/')
    }

    const user: User = JSON.parse(JSON.stringify(locals.user))
    UserStore.set(user)

    try {
      const basket: CartItem[] = await locals.pocketbase.collection('carts').getFullList(undefined, {
				filter: `user="${user.id}"`,
				expand: 'product'
			})

      return { user, cart: basket }
    } catch (e) {
      if (e instanceof Error) throw error(401, e.message)

      throw error(500, 'Internal Server Error')
    }
  } else {
    if (privateRoutes.includes(pathname)) {
      throw redirect(303, '/')
    }

    return { user: null, cart: [] }
  }
}) satisfies LayoutServerLoad;