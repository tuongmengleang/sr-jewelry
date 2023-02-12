export interface IProductImage {
  id?: string
  product_id?: string
  image_path: string
}

export interface IDiamond {
  id?: string
  product_id?: string
  size: string
  quantity: number
}

export interface IProductCategory {
  value: number
  name: string
}

export interface IProduct {
  id?: string
  name: string
  category: number
  gemstone?: number
  wages?: number
  weight?: string
  price?: number
  description?: string
  status?: string
  diamonds?: IDiamond[]
  product_images?: IProductImage[]
  fileIds?: Array<string>
  filePaths?: Array<string>
  active?: boolean
}
