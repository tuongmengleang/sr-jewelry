import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(
  async (event): Promise<{ data: any; error: any }> => {
    const client: any = serverSupabaseClient(event)
    const id: string = event.context.params.id

    // Delete Diamond of Product
    await client.from('diamonds').delete().eq('product_id', id)

    // Delete Product Images
    await client.from('product_images').delete().eq('product_id', id)

    // Delete Product
    const { data, error } = await client.from('products').delete().eq('id', id)

    return { data, error }
  }
)
