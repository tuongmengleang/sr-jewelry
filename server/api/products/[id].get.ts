import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client: any = serverSupabaseClient(event)

  const { data, error } = await client
    .from('products')
    .select(
      'id, name, category, gemstone, wages, weight, price, description, diamonds(size, quantity), product_images(image_path)'
    )
    .eq('id', event.context.params.id)
  return { data, error }
})
