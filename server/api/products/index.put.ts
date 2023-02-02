import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { IDiamond, IProduct } from '~/types/IProduct'

export default defineEventHandler(async (event) => {
  const client: any = serverSupabaseClient(event)
  const body: IProduct = await readBody(event)

  // Update Diamond of Product
  await updateDiamond(event, body.diamonds, body.id)
  // Update Product
  const { data: product, error: err } = await updateProduct(event, body)
  // Update Product Image
  await updateProductImage(event, body.fileIds, body.filePaths)

  return { data: product, error: { ...err } }
})

const updateProductImage = async (
  event: any,
  fileIds: Array<string> | undefined,
  filePaths: Array<string> | undefined
): Promise<any> => {
  const client: any = serverSupabaseClient(event)

  // Remove files
  if (fileIds && fileIds.length > 0) {
    await Promise.all(
      fileIds.map((fileId: string) =>
        client.from('product_images').delete().eq('id', fileId)
      )
    )
  }

  if (filePaths && filePaths.length > 0) {
    const { data, error } = await client.storage
      .from('products')
      .remove(filePaths)
    return { data, error }
  }
}

const updateProduct = async (
  event: any,
  payload: IProduct
): Promise<{ data: any; error: any }> => {
  const client: any = serverSupabaseClient(event)

  // @ts-ignore
  const { data, error } = await client
    .from<IProduct>('products')
    .update({
      name: payload.name,
      category: payload.category,
      gemstone: payload.gemstone,
      wages: payload.wages,
      weight: payload.weight,
      price: payload.price,
      description: payload.description,
    })
    .match({ id: payload.id })
    .select(
      'id, name, category, gemstone, wages, weight, price, description, diamonds(size, quantity), product_images(image_path)'
    )
  return { data, error }
}

const updateDiamond = async (
  event: any,
  diamonds: IDiamond[] | undefined,
  productId: string | undefined
): Promise<any> => {
  const client: any = serverSupabaseClient(event)

  // First Delete all diamonds of product
  const { error: errorDelete } = await client
    .from('diamonds')
    .delete()
    .match({ product_id: productId })

  if (errorDelete) throw errorDelete

  if (diamonds && diamonds.length > 0) {
    const ds = diamonds.map((obj: IDiamond) => ({
      ...obj,
      product_id: productId,
    }))

    // Second Insert new Diamonds
    const { data, error } = await client.from('diamonds').upsert(ds)

    return { data, error }
  }

  return null
}
