import { defineStore } from 'pinia'
import { ICustomer } from '~/types/ICustomer'
import { useSupabaseClient } from '#imports'

interface ICustomerState {
  customer: null | ICustomer
}

export const useCustomer = defineStore('customer', {
  state: (): ICustomerState => ({
    customer: <ICustomer>{
      id: '',
      name: '',
      phone: '',
      address: '',
      avatar: '',
      file: null,
    },
  }),
  actions: {
    removeCustomerFile() {
      this.customer!.file = null
    },
    clearCustomer() {
      this.customer = {
        id: '',
        name: '',
        phone: '',
        address: '',
        avatar: '',
        file: null,
      }
    },
    updateCustomer(newCustomer: ICustomer) {
      this.customer = newCustomer
    },
    updateCustomerByProperty(property: string, value: any) {
      this.customer![property] = value
    },
    async uploadImage(file: File, filename: string): Promise<any> {
      const client = useSupabaseClient()
      const filePath =
        'public/' +
        Date.now() +
        '-' +
        filename.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '_').toLowerCase() //eslint-disable-line

      const { data, error } = await client.storage
        .from('customers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      return { data, error }
    },
    async removeImage(path: string): Promise<{ data: any; error: any }> {
      const client = useSupabaseClient()
      const { data, error } = await client.storage
        .from('customers')
        .remove([path])

      return { data, error }
    },
  },
})
