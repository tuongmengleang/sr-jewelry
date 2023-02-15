export interface IOrder {
  id?: string
  customer_id: string
  status?: number
}

export interface IOrderItems {
  id?: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}
