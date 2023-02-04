import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { ICustomer } from '~/types/ICustomer'

export default defineEventHandler(
  async (event): Promise<{ data: any; error: any }> => {
    const client: any = serverSupabaseClient(event)

    const { name, phone, address, avatar }: any = await readBody(event)
    const id: string = event.context.params.id

    if (id) {
      const { data, error } = await client
        .from('customers')
        .update({ name, phone, address, avatar })
        .eq('id', id)
        .select('*')

      return { data, error }
    }
    return { data: null, error: null }
  }
)
