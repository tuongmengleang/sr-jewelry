import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client: any = serverSupabaseClient(event)

  const { page, limit, q }: any = getQuery(event)

  const from = page ? page * limit : 0
  const to = page ? from + limit : limit

  const sql = client
    .from('customers')
    .select('*', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) sql.or(`or(name.ilike.%${q}%,phone.ilike.%${q}%)`)

  const { data, count } = await sql
  return { data, count }
})
