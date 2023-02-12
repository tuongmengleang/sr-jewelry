<script lang="ts" setup>
/* imports */
import debounce from 'lodash.debounce'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'
import { useCustomer } from '~/stores/customer'
import { ICustomer } from '~/types/ICustomer'
import { IProduct } from '~/types/IProduct'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'បង្កើតការបញ្ជាទិញ',
})

/* states */
const { $profileUrl, $storageFile, $getPagination, $humanPrice } = useNuxtApp()
const customer: any = useCustomer()
const selectedCustomer = ref<ICustomer | null>()
const query = ref<string>('')
const searchText = ref<string>('')
const comboBtn: any = ref<HTMLButtonElement>()
const active = ref<boolean>(false)
const activeProducts: any = ref<Array<string>>([])

/* Fetch API */
const {
  data: customers,
  error,
  refresh,
}: any = await useAsyncData('customers', () =>
  $fetch('/api/customers', {
    method: 'GET',
    params: {
      page: 0,
      limit: 9,
      q: query.value || '',
    },
  })
)

const { data: products }: any = await useAsyncData(
  'products',
  (): Promise<void> => {
    const { from, to } = $getPagination(0, 6)
    return $fetch('/api/products', {
      method: 'GET',
      params: {
        from,
        to,
      },
    })
  }
)

/* methods */
const onDisplayValue: any = (value: ICustomer | null) => {
  return value ? value.name : ''
}
const onFocus = (): void => {
  comboBtn.value.$el.click()
}
const onSelectCustomer = (c: ICustomer): void => {
  selectedCustomer.value = c
}
const onChangeFilter = debounce((event: any) => {
  query.value = event.target.value
  refresh()
}, 1000)

const onSelectProduct = (p: IProduct) => {
  const isExist = activeProducts.value.includes(p)
  const index = products.value.data.findIndex(
    (item: IProduct) => item.id === p.id
  )
  if (isExist) {
    const indexExist = activeProducts.value.findIndex(
      (item: IProduct) => item === p
    )
    activeProducts.value.splice(indexExist, 1)
  } else activeProducts.value.push(p)
  products.value.data[index].active = !products.value.data[index].active
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="បង្កើតការបញ្ជាទិញ" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <div class="grid grid-cols-12 gap-5">
        <div
          class="col-span-12 lg:col-start-2 lg:col-span-8 xl:col-start-4 xl:col-span-4 w-full"
        >
          <div class="space-y-3">
            <!-- Customer -->
            <label class="text-base text-gray-800 font-medium">
              ជ្រើសរើសអតិថិជន
            </label>
            <!-- Auto Complete -->
            <Combobox v-slot="{ open }" v-model="selectedCustomer">
              <div class="relative mt-1">
                <div
                  class="relative cursor-default overflow-hidden rounded-xl border-2 border-gray-900/10"
                >
                  <ComboboxInput
                    class="w-full px-3 py-2.5 text-sm leading-5 text-gray-700 focus:ring-0"
                    :display-value="onDisplayValue"
                    @change="onChangeFilter"
                    @focus="onFocus"
                  />
                  <ComboboxButton
                    ref="comboBtn"
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <IconMaterial-symbols:keyboard-arrow-down-rounded
                      :class="[
                        open ? 'rotate-180' : 'rotate-0',
                        ' text-base text-gray-500 transform-gpu transition-all duration-200',
                      ]"
                      aria-hidden="true"
                    />
                  </ComboboxButton>
                </div>
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
                  @after-leave="query = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 p-1.5 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 z-20 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="customers.data.length === 0 && query !== ''"
                      class="relative cursor-default select-none py-2 px-4 text-gray-700 font-semibold text-center"
                    >
                      រកមិនឃើញអតិថិជន
                    </div>
                    <ComboboxOption
                      v-for="item in customers.data"
                      :key="item.id"
                      v-slot="{ selected, active }"
                      as="template"
                      :value="item"
                    >
                      <li
                        class="relative flex items-center gap-3 cursor-default select-none px-3 py-1.5 rounded-md"
                        :class="{
                          'bg-gray-200': selected,
                          'bg-gray-100': active,
                          'text-gray-900': !active,
                        }"
                        @click="onSelectCustomer(item)"
                      >
                        <Avatar>
                          <img
                            :src="
                              item.avatar
                                ? $profileUrl('customers/' + item.avatar)
                                : ''
                            "
                            alt=""
                          />
                        </Avatar>
                        <p>
                          <span
                            class="block truncate"
                            :class="{
                              'font-semibold': selected,
                              'font-normal': !selected,
                            }"
                          >
                            {{ item.name }}
                          </span>
                          <span
                            class="text-xs text-gray-500"
                            :class="{
                              'font-semibold': selected,
                              'font-normal': !selected,
                            }"
                          >
                            {{ item.phone }}
                          </span>
                        </p>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </transition>
              </div>
            </Combobox>
            <!--          <pre>{{ selectedCustomer }}</pre>-->
            <transition name="fade">
              <CardProfileUser
                v-if="selectedCustomer"
                :image="
                  $profileUrl(
                    selectedCustomer.avatar
                      ? 'customers/' + selectedCustomer.avatar
                      : ''
                  )
                "
                :title="selectedCustomer.name"
                :subtitle="selectedCustomer.phone"
                @onClick="selectedCustomer = null"
              />
            </transition>
          </div>
          <!-- Products -->
          <div class="space-y-3 mt-7">
            <div class="flex items-center justify-between">
              <label class="block text-base text-gray-800 font-medium">
                ផលិផល
              </label>
              <button
                type="button"
                class="text-xl text-gray-600 transition-all transform duration-200 hover:-translate-y-1.1"
                title="បន្ថែមផលិតផល"
                @click="active = true"
              >
                <IconMaterial-symbols:add-circle-outline-rounded />
              </button>
            </div>
            <div class="grid grid-cols-1 gap-y-0 divide-y">
              <CardProductMicro
                v-for="product in activeProducts"
                :key="product.id"
                :image="
                  product.product_images[0].image_path
                    ? $storageFile(
                        'products/' + product.product_images[0].image_path
                      )
                    : ''
                "
                :title="product.name"
                :price="$humanPrice(product.price)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Search Products -->
      <Modal v-model="active" :outside-close="true">
        <h1 class="text-xl text-gray-900 font-semibold">បន្ថែមផលិតផល</h1>
        <div class="py-4 max-h-[500px] overflow-y-auto custom-scrollbar-thin">
          <FormSearchInput
            v-model="searchText"
            name="search"
            placeholder="ស្វែងរកផលិតផល"
            :debounce="1500"
          />
          <div class="grid grid-cols-3 gap-3 mt-5 px-3">
            <CardProductActive
              v-for="product in products.data"
              :key="product.id"
              :image="
                product.product_images[0].image_path
                  ? $storageFile(
                      'products/' + product.product_images[0].image_path
                    )
                  : ''
              "
              :title="product.name"
              :price="$humanPrice(product.price)"
              :is-active="product.active"
              @click="onSelectProduct(product)"
            />
          </div>
        </div>
        <Button size="sm" class="float-right">បញ្ជាក់ការបញ្ជាទិញ</Button>
      </Modal>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
