import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { page, limit }: any = getQuery(event)

  const from = page ? page * limit : 0
  const to = page ? from + limit : limit

  const sql = client
    .from('order_items')
    .select(
      'id, orders(id, customer_id, status, customers(id, name, avatar)), products(id, name, product_images(image_path)), quantity, price, created_at',
      {
        count: 'exact',
      }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, count } = await sql
  return { data, count }
})
