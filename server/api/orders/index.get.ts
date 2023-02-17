import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { page, limit, q }: any = getQuery(event)

  const from = page ? page * limit : 0
  const to = page ? from + limit : limit

  const sql = client
    .from('order_items')
    .select(
      'id, quantity, price, created_at, products!inner(id, name, price, product_images(image_path)), orders!inner(id, status, customers!inner(id, name, avatar))',
      {
        count: 'exact',
      }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) sql.ilike('orders.customers.name', `%${q}%`)

  const { data, count } = await sql
  return { data, count, q }
})
