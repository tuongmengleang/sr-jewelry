import { getQuery } from 'h3'
import moment from 'moment'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { page, limit, q, startDate, endDate }: any = getQuery(event)

  const size = limit ? +limit : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  const sql = client
    .from('orders')
    .select(
      'id, order_id, status, created_at, customers!inner(id, name, phone, avatar), order_items!inner(id, quantity, price, products(id, name, price, product_images(image_path)))',
      {
        count: 'exact',
      }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  // Query by customer name
  if (q) sql.ilike('customers.name', `%${q}%`)
  if (startDate && endDate)
    sql
      .gte('created_at', moment(startDate).format('YYYY-MM-DD'))
      .lte('created_at', moment(endDate).format('YYYY-MM-DD'))

  const { data, count } = await sql
  return {
    data,
    count,
  }
})
