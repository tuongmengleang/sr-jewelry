import { defineStore } from 'pinia'

export interface IOrderState {}

export const useOrder = defineStore('orders', {
  state: (): IOrderState => ({}),
  actions: {},
  getters: {},
})
