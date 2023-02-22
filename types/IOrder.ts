import { ICustomer } from '~/types/ICustomer'
import { IProduct } from '~/types/IProduct'

export interface IOrder {
  id?: string
  order_id: string
  status?: number
  customers: ICustomer
  order_items: Array<{
    id: string
    quantity?: number
    price?: number
    products: IProduct
  }>
}
