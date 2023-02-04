import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { ICustomer } from '~/types/ICustomer'

export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const id: string = event.context.params.id

  const { avatar }: ICustomer = await readBody(event)

  if (avatar) await client.storage.from('customers').remove([avatar])
  if (id) {
    const { data, error } = await client.from('customers').delete().eq('id', id)

    return { data, error }
  }
  return { data: null, error: null }
})
