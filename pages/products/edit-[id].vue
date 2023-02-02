<script lang="ts" setup>
/* imports */
import * as Yup from 'yup'
import useToast from '~/composables/useToast'
import { useProduct } from '~/stores/product'
import { IProduct } from '~/types/IProduct'
import { useUI } from '~/stores/ui'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'កែប្រែផលិតផល',
})

/* vars */
const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const product = useProduct()
const ui = useUI()
const { $storageFile, $pathToFilename, $getFileSizeFromUrl, $humanFileSize } =
  useNuxtApp()
const productForm: any = ref<HTMLElement>()
const wagesRef: any = ref<HTMLElement>()
const priceRef: any = ref<HTMLElement>()

const schema = Yup.object().shape({
  name: Yup.string().required('សូមបំពេញឈ្មោះផលិតផល'),
  category: Yup.string().required('សូមជ្រើសរើសប្រភេទ'),
  wages: Yup.string().required('សូមបំពេញថ្លៃឈ្នួល'),
  price: Yup.string().required('សូមបំពេញតម្លៃ'),
  diamonds: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().required('សូមបំពេញចំនួន'),
      size: Yup.string().required('សូមបំពេញទំហំ'),
    })
  ),
})

/* onMounted */
onMounted(async () => {
  product.clearFiles()
  product.clearFileIds()
  const { data, error }: any = await client
    .from('products')
    .select(
      'id, name, category, gemstone, wages, weight, price, description, diamonds(size, quantity), product_images(id, image_path)'
    )
    .eq('id', route.params.id)
  productForm.value.setValues({
    name: data[0]!.name,
    category: data[0].category,
    gemstone: data[0].gemstone,
    diamonds: data[0].diamonds,
    weight: data[0].weight,
    description: data[0].description,
  })
  wagesRef.value.updateValue(data[0].wages)
  priceRef.value.updateValue(data[0].price)
  if (data[0].product_images && data[0].product_images.length > 0) {
    for (let i = 0; i < data[0].product_images.length; i++) {
      product.appendFiles({
        id: data[0].product_images[i].id,
        src: $storageFile('products/' + data[0].product_images[i].image_path),
        file: null,
        name: $pathToFilename(data[0].product_images[i].image_path),
        size: $humanFileSize(
          $getFileSizeFromUrl(
            $storageFile('products/' + data[0].product_images[i].image_path)
          )
        ),
        originalName: data[0].product_images[i].image_path,
        extension: /[.]/.exec(data[0].product_images[i].image_path)
          ? /[^.]+$/.exec(data[0].product_images[i].image_path)
          : undefined,
      })
    }
  }
})

/* methods */
const onSubmit = async (values: any): Promise<void> => {
  ui.updateIsLoading(true)
  const { data, error }: any = await useAsyncData('product', () =>
    $fetch('/api/products', {
      method: 'PUT',
      body: {
        id: route.params.id,
        name: values.name,
        category: values.category,
        gemstone: values.gemstone,
        diamonds: values.diamonds,
        wages: values.wages,
        weight: values.weight,
        price: values.price,
        description: values.description,
        fileIds: product.fileIds,
        filePaths: product.filePaths,
      },
    })
  )
  const imagesPath = await Promise.all(
    product.files.map((file: any) => product.uploadFile(file.file, file.name))
  )
  const images = imagesPath
    .filter((img: any) => img !== null)
    .map((item: any) => {
      return {
        image_path: item.data.path,
        product_id: route.params.id,
      }
    })
  await product.createProductImage(images)

  ui.updateIsLoading(false)
  useToast().success('កែប្រែផលិតផលជោគជ័យ')
  router.push({ name: 'products' })
}
const onChange = (file: File | Blob): void => {
  product.appendFiles({
    src: URL.createObjectURL(file),
    file,
    name: file.name,
    size: $humanFileSize(file.size),
    originalName: file.name,
    extension: /[.]/.exec(file.name) ? /[^.]+$/.exec(file.name) : undefined,
  })
}

const removeFile = (index: number, id: string, path: string): void => {
  product.deleteFile(index)
  product.pushFileIds(id)
  product.pushFilePaths(path)
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="កែប្រែផលិតផល" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <Form
        v-slot="{ handleSubmit }"
        ref="productForm"
        :validation-schema="schema"
        as="div"
      >
        <form
          id="editProductForm"
          class="grid grid-cols-6 gap-7"
          @submit="handleSubmit($event, onSubmit)"
        >
          <div
            class="xl:col-start-2 xl:col-end-4 lg:col-span-3 md:col-span-3 col-span-6 space-y-3"
          >
            <FormInput
              name="name"
              type="text"
              label="ឈ្មោះ"
              placeholder="ខ្សែកស្វារ៉េ"
              error-message="សូមបំពេញឈ្មោះ"
            />
            <FormSelect
              name="category"
              label="ប្រភេទ"
              placeholder="ខ្សែក"
              :items="product.categories"
              error-message="សូមជ្រើសរើសប្រភេទ"
            />
            <FormSelect
              name="gemstone"
              label="ត្បូង"
              placeholder="ខ្សែក"
              :items="product.gemstones"
              error-message="សូមជ្រើសរើសត្បូង"
            />
            <fieldset>
              <label class="text-md text-gray-700 font-medium">
                ចំនួនត្បូង
              </label>
              <div class="relative w-full border-2 rounded-lg p-4">
                <FieldArray v-slot="{ fields, push, remove }" name="diamonds">
                  <button
                    type="button"
                    class="mr-auto flex items-center justify-center gap-x-1 p-1.5 transform duration-200 rounded-full bg-primary text-white text-sm font-semibold hover:-translate-y-1.2 hover:shadow-lg hover:shadow-primary-200"
                    @click="push({ quantity: '', size: '' })"
                  >
                    <IconMaterial-symbols:add-circle-rounded
                      class="text-base"
                    />
                    បន្ថែមត្បូង
                  </button>
                  <div
                    v-for="(entry, index) in fields"
                    :key="index"
                    class="flex items-center gap-x-3 mb-2"
                  >
                    <FormNumberInput
                      :name="`diamonds[${index}].quantity`"
                      type="text"
                      label="ចំនួន"
                      placeholder="10"
                    />
                    <FormInput
                      :name="`diamonds[${index}].size`"
                      type="text"
                      label="ទំហំ"
                      placeholder="2 L"
                    />
                    <button
                      type="button"
                      class="flex-none mt-5 flex items-center justify-center p-1.5 rounded-full transform duration-200 bg-red-500 text-gray-200 hover:-translate-y-1.2 hover:shadow-lg hover:shadow-red-400"
                      @click="remove(index)"
                    >
                      <IconWpf:full-trash />
                    </button>
                  </div>
                </FieldArray>
              </div>
            </fieldset>
            <FormInput
              name="weight"
              type="text"
              label="ទម្ងន់មាស"
              placeholder="5 ជី"
            />
            <FormCurrencyInput
              ref="wagesRef"
              name="wages"
              label="ប្រាក់ឈ្នួល"
              placeholder="$50"
              :options="{ currency: 'USD' }"
            />
            <FormCurrencyInput
              ref="priceRef"
              name="price"
              type="text"
              label="តម្លៃ"
              placeholder="$999"
              :options="{ currency: 'USD' }"
            />
            <FormInput
              name="description"
              type="textarea"
              label="ការពិពណ៌នា"
              placeholder="ការពិពណ៌នា"
            />
          </div>
          <div
            class="xl:col-end-6 xl:col-span-2 lg:col-span-3 md:col-span-3 col-span-6"
          >
            <label class="text-md text-gray-700 font-medium">រូបភាព</label>
            <FilePond @onChange="onChange" />
            <div
              class="custom-scrollbar-thin pt-3 grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto"
            >
              <CardFileList
                v-for="(img, i) in product.files"
                :key="i"
                :src="img.src"
                :name="img.name ? img.name : ''"
                :size="img.size ? img.size : ''"
                @onDelete="removeFile(i, img.id, img.originalName)"
              />
            </div>
          </div>
          <div
            class="w-full relative xl:col-start-2 xl:col-span-4 lg:col-span-6 md:col-span-6 col-span-6"
          >
            <div class="fixed bottom-4 right-5">
              <Button
                type="submit"
                form="editProductForm"
                :loading="ui.isLoading"
                class="float-right"
              >
                កែប្រែ
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
