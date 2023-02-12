import { defineStore } from 'pinia'
import { IFile } from '~/types/IFile'
import {
  IProductCategory,
  IProduct,
  IDiamond,
  IProductImage,
} from '~/types/IProduct'
import { useSupabaseClient } from '#imports'

export interface IProductState {
  files: IFile[]
  fileIds: Array<string>
  filePaths: Array<string>
  categories: IProductCategory[]
  gemstones: IProductCategory[]
  product: IProduct
  products: Array<IProduct>
}

export const useProduct = defineStore('product', {
  state: (): IProductState => ({
    files: [],
    fileIds: [],
    filePaths: [],
    categories: [
      {
        value: 1,
        name: 'ក្រវិល',
      },
      {
        value: 2,
        name: 'ខ្សែក',
      },
      {
        value: 3,
        name: 'បណ្តោង',
      },
      {
        value: 4,
        name: 'ខ្សែដៃ',
      },
      {
        value: 5,
        name: 'ចិញ្ចៀន',
      },
      {
        value: 6,
        name: 'កងដៃ',
      },
    ],
    gemstones: [
      {
        value: 1,
        name: 'ពេជ្រ',
      },
      {
        value: 2,
        name: 'ស្នាយ',
      },
      {
        value: 3,
        name: 'ពាក្ស',
      },
      {
        value: 4,
        name: 'ផ្សេងៗ',
      },
    ],
    product: {
      id: '',
      name: '',
      category: 1,
      gemstone: 1,
      wages: 0,
      weight: '',
      price: 0,
      description: '',
      status: '',
      diamonds: [],
      product_images: [],
      fileIds: [],
      filePaths: [],
    },
    products: [],
  }),
  actions: {
    clearFiles() {
      this.files = []
    },
    appendFiles(file: IFile): void {
      this.files.push(file)
    },
    deleteFile(index: number): void {
      this.files.splice(index, 1)
    },
    updateFile(file: File | Blob, prop: string, i: number): void {
      this.files[i][prop] = file
    },
    removeAllFiles(): void {
      this.files = []
    },
    pushFileIds(id: string) {
      this.fileIds.push(id)
    },
    clearFileIds() {
      this.fileIds = []
    },
    pushFilePaths(path: string) {
      this.filePaths.push(path)
    },
    clearFilePaths() {
      this.filePaths = []
    },
    updateProduct(product: IProduct) {
      this.product = product
    },
    pushProducts(products: Array<IProduct>) {
      this.products.push(...products)
    },
    async uploadFile(file: File | Blob, filename: string): Promise<{} | null> {
      const client = useSupabaseClient()
      const filePath =
        'public/' +
        Date.now() +
        '-' +
        filename.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '_').toLowerCase() //eslint-disable-line
      if (file) {
        const { data, error } = await client.storage
          .from('products')
          .upload(filePath, file, {
            // contentType: 'image/jpg',
            cacheControl: '3600',
            upsert: false,
          })
        return { data, error }
      } else return null
    },
    async createProductImage(images: any): Promise<{}> {
      const client = useSupabaseClient()
      const { data, error } = await client.from('product_images').upsert(images)
      return { data, error }
    },
    // Remove product images
    async removeProductImage(
      paths: string[]
    ): Promise<{ data: any; error: any }> {
      const client = useSupabaseClient()
      const { data, error } = await client.storage
        .from('products')
        .remove(paths)
      return { data, error }
    },
  },
})
