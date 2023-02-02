import { defineStore } from 'pinia'

export interface IUi {
  showDrawer: boolean
  isLoading: boolean
}

export const useUI = defineStore('ui', {
  state: (): IUi => ({
    showDrawer: false,
    isLoading: false,
  }),
  actions: {
    updateShowDrawer(status: boolean) {
      this.showDrawer = status
    },
    updateIsLoading(status: boolean) {
      this.isLoading = status
    },
  },
})
