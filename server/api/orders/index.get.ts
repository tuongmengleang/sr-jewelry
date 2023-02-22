import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { page, limit, q }: any = getQuery(event)

  const size = limit ? +limit : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  const sql = client
    .from('orders')
    .select(
      'id, order_id, status, created_at, customers!inner(id, name, avatar), order_items!inner(id, quantity, price, products(id, name, price, product_images(image_path)))',
      {
        count: 'exact',
      }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  // Query by customer name
  if (q) sql.ilike('customers.name', `%${q}%`)

  const { data, count } = await sql
  return { data, count }
})
