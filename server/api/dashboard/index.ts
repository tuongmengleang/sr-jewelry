import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event): Promise<any> => {
  const client: any = serverSupabaseClient(event)

  /* Total Customers */
  const { count: totalCustomer } = await client
    .from('customers')
    .select('*', { count: 'exact' })

  /* Total Products */
  const { count: totalProducts } = await client
    .from('products')
    .select('*', { count: 'exact' })

  /* Total Orders */
  const { count: totalOrders } = await client
    .from('orders')
    .select('*', { count: 'exact' })

  /* Total Revenue */
  // const { data: totalRevenue } = await client
  //   .from('order_items')
  //   .select('quantity, price')
  const { data: totalRevenue } = await client.rpc('sum_price')

  return { totalCustomer, totalProducts, totalOrders, totalRevenue }
})
