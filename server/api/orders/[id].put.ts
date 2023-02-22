import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { customerId } = await readBody(event)

  const { data, error } = await client
    .from('orders')
    .update({ customer_id: customerId })
    .eq('id', event.context.params.id)
    .select('*')
    .single()

  return { data, error }
})
