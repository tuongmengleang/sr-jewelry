import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { IProduct } from '~/types/IProduct'

export default defineEventHandler(async (event) => {
  const client: any = serverSupabaseClient(event)
  const { from, to, name, category, gemstone } = getQuery(event)
  // @ts-ignore
  const sql = client
    .from<IProduct>('products')
    .select(
      'id, name, category, gemstone, wages, weight, price, description, diamonds(size, quantity), product_images(image_path)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(parseInt(String(from)), parseInt(String(to)))

  // Filter by product name
  if (name) sql.or(`or(name.ilike.%${name}%)`)

  // Filter by category
  if (category) sql.eq('category', category)

  // Filter by gemstone
  if (gemstone) sql.eq('gemstone', gemstone)

  const { data, count, error } = await sql

  return { data, count, error }
})
