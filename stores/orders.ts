import { defineStore } from 'pinia'
import { IOrder } from '~/types/IOrder'

interface IOrderState {
  order: IOrder | null
}

export const useOrder = defineStore('order', {
  state: (): IOrderState => ({
    order: null,
  }),
  getters: {
    getOrder: (state) => state.order,
  },
  actions: {
    setOrder(orderItem: IOrder): void {
      this.order = orderItem
    },
  },
})
