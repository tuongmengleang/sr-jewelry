import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { name, phone, address, avatar }: any = await readBody(event)

  const { data, error } = await client
    .from('customers')
    .insert([
      {
        name,
        phone,
        address,
        avatar,
      },
    ])
    .select('*')
  return { data, error }
})
