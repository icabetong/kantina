import pocketbase from "$lib/backend"
import { json, error } from "@sveltejs/kit"
import { ClientResponseError } from "pocketbase"
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.id
    const form = await request.formData()

    if (!id) return json({ error: 'No product id specified' })

    await pocketbase.collection('products').update(id, form)
    return json({ status: 200 })
  } catch (e) {
    console.error(e)
    if (e instanceof ClientResponseError) return json({ error: e })

    throw error(500, 'Internal Server Error')
  }
}