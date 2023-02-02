import { readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { IProduct, IProductImage } from '~/types/IProduct'

export default defineEventHandler(async (event) => {
  const payload: any = await readBody<IProduct>(event)
  const data = await createProduct(payload, event)
  const diamond =
    payload.diamonds && payload.diamonds.length > 0
      ? await createDiamonds(
          { diamonds: payload.diamonds, product_id: data[0].id },
          event
        )
      : null
  return { data: { product: data, diamond } }
})

/* Create New Product */
const createProduct = async (payload: IProduct, event: any): Promise<void> => {
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    const client: any = serverSupabaseClient(event)
    const { data, error } = await client
      .from('products')
      .insert([
        {
          name: payload.name,
          category: parseInt(String(payload.category)),
          gemstone: parseInt(String(payload.gemstone)),
          wages: payload.wages,
          weight: payload.weight,
          price: payload.price,
          description: payload.description,
        },
      ])
      .select('id')
    if (error) reject(error)
    else resolve(data)
  })
}

/* Create Diamond of Product */
const createDiamonds = async (payload: any, event: any): Promise<{}> => {
  const client: any = serverSupabaseClient(event)
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise<{}>(async (resolve, reject): Promise<void> => {
    const { data, error } = await client.from('diamonds').upsert(
      payload.diamonds.map((obj: any) => ({
        ...obj,
        product_id: payload.product_id,
      }))
    )
    if (error) reject(error)
    else resolve(data)
  })
}

/* Upload Product Image */
const uploadFile = async (
  file: File | Blob,
  filename: string,
  event: any
): Promise<void> => {
  const client: any = serverSupabaseClient(event)
  const filePath =
    'public/' +
    Date.now() +
    '-' +
    filename.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '_').toLowerCase() //eslint-disable-line

  // eslint-disable-next-line no-async-promise-executor
  return await new Promise<void>(async (resolve, reject) => {
    const { data, error } = await client.storage
      .from('products')
      .upload(filePath, file, {
        // contentType: 'image/jpg',
        cacheControl: '3600',
        upsert: false,
      })
    console.log({ data, error })
    if (error) reject(error)
    else resolve(data)
  })
}

// Insert File Path
const createProductImage = async (
  images: Array<IProductImage>,
  event: any
): Promise<{}> => {
  const client: any = serverSupabaseClient(event)
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    const { data, error } = await client.from('product_images').upsert(images)

    if (error) reject(error)
    else resolve(data)
  })
}
