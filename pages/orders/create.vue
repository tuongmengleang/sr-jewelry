<script lang="ts" setup>
/* imports */
import debounce from 'lodash.debounce'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Popover,
  PopoverButton,
  PopoverPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import { useCustomer } from '~/stores/customer'
import { ICustomer } from '~/types/ICustomer'
import { IProduct } from '~/types/IProduct'
import { useProduct } from '~/stores/product'
import { useUI } from '~/stores/ui'
import useToast from '~/composables/useToast'

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
const product: any = useProduct()
const ui = useUI()
const selectedCustomer: any = ref<ICustomer | null>()
const query = ref<string>('')
const searchText = ref<string>('')
const searchInput: any = ref<HTMLElement | null>(null)
const category = ref<number | null>(null)
const gemstone = ref<number | null>(null)
const comboBtn: any = ref<HTMLButtonElement>()
const active = ref<boolean>(false)
const activeProducts: any = ref<Array<string>>([])
const totalPrice = ref<number>(0)
const page = ref<number>(0)

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

const { data: products, refresh: refreshProducts }: any = await useAsyncData(
  'products',
  (): Promise<void> => {
    const { from, to } = $getPagination(0, 12)
    return $fetch('/api/products', {
      method: 'GET',
      params: {
        name: searchText.value,
        category: category.value || '',
        gemstone: gemstone.value || '',
        from,
        to,
      },
    })
  }
)

watch(activeProducts.value, () => {
  totalPrice.value = 0
  activeProducts.value.forEach(
    (activeProduct) =>
      (totalPrice.value +=
        parseInt(activeProduct.price) * parseInt(activeProduct.countOrder))
  )
})

watch([searchText, category, gemstone], () => {
  refreshProducts()
})

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

const onSelectProduct = (p: IProduct): void => {
  const isExist = activeProducts.value.includes(p)
  const index = products.value.data.findIndex(
    (item: IProduct) => item.id === p.id
  )
  if (isExist) {
    const indexExist = activeProducts.value.findIndex(
      (item: IProduct) => item === p
    )
    activeProducts.value.splice(indexExist, 1)
  } else {
    p.countOrder = 1
    activeProducts.value.push(p)
  }
  products.value.data[index].active = !products.value.data[index].active
}

const onDeleteOrder = (index: number, productId: string): void => {
  activeProducts.value.splice(index, 1)
  const i = products.value.data.findIndex(
    (item: IProduct) => item.id === productId
  )
  products.value.data[i].active = false
}

const clearFilter = (): void => {
  searchText.value = ''
  searchInput.value.setValue('')
  category.value = null
  gemstone.value = null
  refreshProducts()
}

const onFilterProduct = (c, g): void => {
  category.value = c
  gemstone.value = g
}

const onPurchase = async (): Promise<any> => {
  ui.updateIsLoading(true)
  await useAsyncData('order', () =>
    $fetch('/api/orders', {
      method: 'POST',
      body: {
        customerId: selectedCustomer.value.id,
        products: activeProducts.value,
      },
    })
  )
  ui.updateIsLoading(false)
  products.value.data.map((p: IProduct) => (p.active = false))
  selectedCustomer.value = null
  activeProducts.value = []
  useToast().success('បញ្ជាទិញដោយជោគជ័យ')
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
                v-for="(product, index) in activeProducts"
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
                @onDelete="onDeleteOrder(index, product.id)"
              >
                <vs-input-number v-model="product.countOrder" min="1" />
              </CardProductMicro>
            </div>
            <div
              v-if="activeProducts.length > 0"
              class="w-full flex items-center pt-3"
            >
              <p class="ml-auto">
                <span class="text-sm text-gray-500 font-medium">
                  តម្លៃសរុប ៖
                </span>
                <span
                  class="inline-block ml-5 text-base text-red-600 font-semibold"
                >
                  {{ $humanPrice(totalPrice) }}
                </span>
              </p>
            </div>
            <div
              v-if="selectedCustomer && activeProducts.length > 0"
              class="w-full pt-5"
            >
              <Button :loading="ui.isLoading" @click="onPurchase">
                បញ្ជាទិញ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Search Products -->
      <Modal v-model="active" :outside-close="true">
        <h1 class="text-xl text-gray-900 font-semibold">បន្ថែមផលិតផល</h1>
        <div class="py-4 max-h-[70vh] overflow-y-auto custom-scrollbar-thin">
          <div class="w-full flex items-center gap-3">
            <FormSearchInput
              ref="searchInput"
              v-model="searchText"
              name="search"
              placeholder="ស្វែងរកផលិតផល"
              :debounce="1500"
              class="w-full"
            />
            <Popover v-slot="{ open }" class="relative">
              <PopoverButton
                :class="open ? 'border-gray-300 bg-gray-50' : 'text-opacity-90'"
                class="group inline-flex items-center px-3 py-2 rounded-xl shadow border-2 border-gray-900/10 text-base font-medium text-gray-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <IconIc:round-filter-list class="mr-2" />
                <span>តម្រង</span>
              </PopoverButton>
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
              >
                <PopoverPanel
                  class="absolute right-0 z-30 mt-3 w-[380px] lg:w-70 -translate-x-1/2 transform"
                >
                  <div
                    class="overflow-hidden rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="p-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-gray-700 font-medium">
                          តម្រង
                        </h1>
                        <button
                          type="button"
                          class="text-base underline text-gray-500"
                          @click="clearFilter"
                        >
                          លុបតម្រង
                        </button>
                      </div>
                      <div class="space-y-3 pt-3">
                        <Disclosure v-slot="{ open }">
                          <DisclosureButton
                            class="w-full flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                          >
                            <span>ប្រភេទផលិតផល</span>
                            <IconIc:round-keyboard-arrow-down
                              :class="[
                                open ? 'rotate-180' : 'rotate-0',
                                'transform-gpu transition-all duration-200',
                              ]"
                            />
                          </DisclosureButton>
                          <DisclosurePanel
                            class="w-full flex flex-row flex-wrap gap-2 p-2 text-sm text-gray-500"
                          >
                            <div
                              v-for="c in product.categories"
                              :key="c.value"
                              class="relative flex items-center gap-3 px-2 py-1 shadow border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                              :class="{
                                'bg-gray-100 text-gray-700 font-semibold':
                                  category === c.value,
                              }"
                              @click="onFilterProduct(c.value, gemstone)"
                            >
                              <span>
                                {{ c.name }}
                              </span>
                              <div
                                v-if="category === c.value"
                                class="absolute -top-1.5 -right-1 p-[2px] bg-primary rounded-full"
                              >
                                <IconTypcn:tick
                                  class="text-[10px] text-white"
                                />
                              </div>
                            </div>
                          </DisclosurePanel>
                        </Disclosure>
                        <Disclosure v-slot="{ open }">
                          <DisclosureButton
                            class="w-full flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                          >
                            <span>ប្រភេទត្បូង</span>
                            <IconIc:round-keyboard-arrow-down
                              :class="[
                                open ? 'rotate-180' : 'rotate-0',
                                'transform-gpu transition-all duration-200',
                              ]"
                            />
                          </DisclosureButton>
                          <DisclosurePanel
                            class="w-full flex flex-row flex-wrap gap-2 p-2 text-sm text-gray-500"
                          >
                            <div
                              v-for="c in product.gemstones"
                              :key="c.value"
                              class="relative flex items-center gap-3 px-2 py-1 shadow border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                              :class="{
                                'bg-gray-100 text-gray-700 font-semibold':
                                  gemstone === c.value,
                              }"
                              @click="onFilterProduct(category, c.value)"
                            >
                              <span>
                                {{ c.name }}
                              </span>
                              <div
                                v-if="gemstone === c.value"
                                class="absolute -top-1.5 -right-1 p-[2px] bg-primary rounded-full"
                              >
                                <IconTypcn:tick
                                  class="text-[10px] text-white"
                                />
                              </div>
                            </div>
                          </DisclosurePanel>
                        </Disclosure>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </transition>
            </Popover>
          </div>
          <div
            id="list"
            class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 px-3"
          >
            <template v-if="products.data.length > 0">
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
            </template>
            <div v-else class="col-span-2 md:col-span-4 text-center py-10">
              <CardEmpty class="mx-auto" />
            </div>
          </div>
        </div>
        <!--        <Button size="sm" class="float-right">បញ្ជាក់ការបញ្ជាទិញ</Button>-->
      </Modal>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
