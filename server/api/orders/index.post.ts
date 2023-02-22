import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { IProduct } from '~/types/IProduct'
export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)
  const { orderId, customerId, products }: any = await readBody(event)

  // Insert Order
  const { data, error } = await client
    .from('orders')
    .insert([{ customer_id: customerId, order_id: orderId }])
    .select('id')

  // Insert OrderItems
  if (error) return
  const orderItems = products.map((p: IProduct) => ({
    product_id: p.id,
    quantity: p.countOrder,
    price:
      parseInt(String(p.countOrder)) > 0
        ? parseInt(String(p.countOrder)) * parseInt(String(p.price))
        : p.price,
    order_id: data[0].id,
  }))
  await client.from('order_items').insert(orderItems)
  return { data, error }
})
