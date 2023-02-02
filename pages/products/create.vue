<script lang="ts" setup>
/* imports */
import * as Yup from 'yup'
import useToast from '~/composables/useToast'
import { useProduct } from '~/stores/product'
import { useUI } from '~/stores/ui'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'បង្កើតផលិតផល',
})

/* vars */
const { $humanFileSize } = useNuxtApp()
const toast = useToast()
const product = useProduct()
const ui = useUI()
const wagesRef: any = ref<HTMLElement>()
const priceRef: any = ref<HTMLElement>()

const schema = Yup.object().shape({
  name: Yup.string().required('សូមបំពេញឈ្មោះផលិតផល'),
  category: Yup.string().required('សូមជ្រើសរើសប្រភេទ'),
  wages: Yup.string().required('សូមបំពេញថ្លៃឈ្នួល'),
  price: Yup.string().required('សូមបំពេញតម្លៃ'),
  diamonds: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.string().required('សូមបំពេញចំនួន'),
      size: Yup.string().required('សូមបំពេញទំហំ'),
    })
  ),
})

onMounted(() => {
  product.clearFiles()
  product.clearFileIds()
})

/* methods */
const onSubmit = async (values: any, actions: any): Promise<void> => {
  ui.updateIsLoading(true)
  const { data, error }: any = await useAsyncData('product', () =>
    $fetch('/api/products', {
      method: 'POST',
      body: {
        name: values.name,
        category: values.category,
        gemstone: values.gemstone,
        diamonds: values.diamonds,
        wages: values.wages,
        weight: values.weight,
        price: values.price,
        description: values.description,
      },
    })
  )
  const imagesPath = await Promise.all(
    product.files.map((file: any) => product.uploadFile(file.file, file.name))
  )
  console.log('imagesPath :', imagesPath)
  const images = imagesPath.map((item: any) => {
    return {
      image_path: item.data.path,
      product_id: data.value.data.product[0].id,
    }
  })
  await product.createProductImage(images)
  ui.updateIsLoading(false)
  // Reset Form Data
  actions.resetForm({
    values: {
      name: '',
      category: '',
      gemstone: '',
      diamonds: [
        {
          size: '',
          quantity: '',
        },
      ],
      wages: '',
      weight: '',
      price: '',
      description: '',
    },
  })
  wagesRef.value.updateValue('')
  priceRef.value.updateValue('')
  product.removeAllFiles()
  toast.success('បង្កើតផលិតផលជោគជ័យ')
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

const onCompress = (file: File | Blob, index: number): void => {
  product.updateFile(file, 'file', index)
}

const removeFile = (index: number): void => {
  product.deleteFile(index)
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="បង្កើតផលិតផល" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <Form
        id="createProductForm"
        v-slot="{ values }"
        class="grid grid-cols-6 gap-7"
        :validation-schema="schema"
        @submit="onSubmit"
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
          <fieldset v-if="values.gemstone">
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
                  <IconMaterial-symbols:add-circle-rounded class="text-base" />
                  បន្ថែមត្បូង
                </button>
                <div
                  v-for="(entry, idx) in fields"
                  :key="entry.key"
                  class="flex items-center gap-x-3 mb-2"
                >
                  <FormNumberInput
                    :name="`diamonds[${idx}].quantity`"
                    type="text"
                    label="ចំនួន"
                    placeholder="10"
                    class="self-start"
                  />
                  <FormInput
                    :name="`diamonds[${idx}].size`"
                    type="text"
                    label="ទំហំ"
                    placeholder="2 L"
                    class="self-start"
                  />
                  <button
                    type="button"
                    class="flex-none mt-5 flex items-center justify-center p-1.5 rounded-full transform duration-200 bg-red-500 text-gray-200 hover:-translate-y-1.2 hover:shadow-lg hover:shadow-red-400"
                    @click="remove(idx)"
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
          <FilePond @onChange="onChange" @onCompress="onCompress" />
          <div
            class="custom-scrollbar-thin pt-3 grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto"
          >
            <CardFileList
              v-for="(img, i) in product.files"
              :key="i"
              :src="img.src"
              :name="img.name ? img.name : ''"
              :size="img.size ? img.size : ''"
              @onDelete="removeFile(i)"
            />
          </div>
        </div>
        <div
          class="w-full relative xl:col-start-2 xl:col-span-4 lg:col-span-6 md:col-span-6 col-span-6"
        >
          <div class="fixed bottom-4 right-5">
            <Button
              type="submit"
              form="createProductForm"
              :loading="ui.isLoading"
              class="float-right"
            >
              បង្កើត
            </Button>
          </div>
        </div>
      </Form>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss"></style>
