<script lang="ts" setup>
/* imports */
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { useProduct } from '~/stores/product'
import { IProductCategory, IProduct } from '~/types/IProduct'
import { useUI } from '~/stores/ui'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'បញ្ជីផលិតផល',
})

/* vars */
const { $formatCurrency, $storageFile, $getPagination, $pagination } =
  useNuxtApp()
const router = useRouter()
const route = useRoute()
const product = useProduct()
const ui = useUI()
const currentPage = ref<number>(1)
const page = ref<number>(0)
const size = ref<number>(12)
const activeDelete = ref<boolean>(false)
const activeView = ref<boolean>(false)
const searchText = ref<string>('')

const category = computed(() => route.query.category)
const gemstone = computed(() => route.query.gemstone)

const {
  data: products,
  error,
  refresh,
  pending,
} = await useAsyncData('products', (): Promise<void> => {
  const { from, to } = $getPagination(page.value, size.value)
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
})

watch([currentPage, searchText, category, gemstone], ([newValue]) => {
  currentPage.value = newValue
  page.value = newValue - 1
  refresh()
})

const filterCategory = (value: number) => {
  return product.categories.find((c: IProductCategory) => c.value === value)
}

const filterGemstone = (value: number) => {
  return product.gemstones.find((g: IProductCategory) => g.value === value)
}

const onView = (p: IProduct) => {
  product.updateProduct(p)
  activeView.value = true
}

const onDelete = (p: IProduct) => {
  product.updateProduct(p)
  activeDelete.value = true
}

const confirmDelete = async (): Promise<void> => {
  ui.updateIsLoading(true)
  await useFetch(`/api/products/${product.product.id}`, {
    method: 'DELETE',
  })
  let imagePaths: string[] = []
  if (product.product.product_images!.length > 0) {
    imagePaths = product.product.product_images!.map((item) => item.image_path)
  }
  await product.removeProductImage(imagePaths)
  refresh()
  ui.updateIsLoading(false)
  activeDelete.value = false
}

const setFilterQuery = (category: any, gemstone: any): void => {
  router.push({ query: { category, gemstone } })
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="ផលិតផល" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-10">
      <div class="w-full flex items-center">
        <NuxtLink :to="{ name: 'products-create' }" class="ml-auto">
          <Button>
            <IconIc:outline-add-shopping-cart class="text-lg mr-2" />
            បង្កើតផលិតផល
          </Button>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-5 mt-4">
        <!-- Search by name -->
        <FormSearchInput
          v-model="searchText"
          class="w-70"
          name="search"
          placeholder="ស្វែងរកផលិតផលដោយឈ្មោះ"
          :debounce="1500"
        />
        <!-- Filter Dropdown -->
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
                    <h1 class="text-base text-gray-700 font-medium">តម្រង</h1>
                    <button
                      type="button"
                      class="text-base underline text-gray-500"
                      @click="$router.replace({ query: {} })"
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
                              parseInt(String(category)) === c.value,
                          }"
                          @click="
                            setFilterQuery(c.value, $route.query.gemstone)
                          "
                        >
                          <span>
                            {{ c.name }}
                          </span>
                          <div
                            v-if="parseInt(String(category)) === c.value"
                            class="absolute -top-1.5 -right-1 p-[2px] bg-primary rounded-full"
                          >
                            <IconTypcn:tick class="text-[10px] text-white" />
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
                              parseInt(String(gemstone)) === c.value,
                          }"
                          @click="
                            setFilterQuery($route.query.category, c.value)
                          "
                        >
                          <span>
                            {{ c.name }}
                          </span>
                          <div
                            v-if="parseInt(String(gemstone)) === c.value"
                            class="absolute -top-1.5 -right-1 p-[2px] bg-primary rounded-full"
                          >
                            <IconTypcn:tick class="text-[10px] text-white" />
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

      <!-- Table Product -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-5 pb-5"
      >
        <template v-if="pending">
          <CardSkeleton v-for="n in size" :key="n" />
        </template>
        <template v-else>
          <template v-if="products!['data']['length'] > 0">
            <CardProduct
              v-for="(p, idx) in products!['data']"
              :key="idx"
              :title="p['name']"
              :images="p['product_images']"
              :status="filterCategory(p['category'])!['name']"
              :price="$formatCurrency(p['price'])"
            >
              <template #dropdown>
                <Menu as="div">
                  <MenuButton
                    class="p-1.5 rounded-full bg-gray-200 border text-xs text-gray-600 transition-all duration-250 ring-0 border-none"
                  >
                    <IconSimple-line-icons:options-vertical />
                  </MenuButton>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="absolute right-0 mt-2 w-24 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div class="p-1.5">
                        <MenuItem v-slot="{ active }">
                          <button
                            type="button"
                            :class="[
                              active ? 'bg-gray-100' : '',
                              'group flex items-center gap-x-2 w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900',
                            ]"
                            @click="onView(p)"
                          >
                            <IconRi:eye-2-line />
                            មើល
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <RouterLink
                            :to="{
                              name: 'products-edit-id',
                              params: { id: p['id'] },
                            }"
                            :class="[
                              active ? 'bg-gray-100' : '',
                              'group flex items-center gap-x-2 w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900',
                            ]"
                          >
                            <IconHumbleicons:pencil />
                            កែប្រែ
                          </RouterLink>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            type="button"
                            :class="[
                              active ? 'bg-gray-100' : '',
                              'group flex items-center gap-x-2 w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900',
                            ]"
                            @click="onDelete(p)"
                          >
                            <IconHeroicons:trash />
                            លុប
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </template>
            </CardProduct>
          </template>
          <div v-else class="col-span-12 flex items-center justify-center mt-5">
            <CardEmpty class="mx-auto" />
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div
        v-if="products!['data']['length'] > 0"
        class="w-full grid place-items-center mt-4"
      >
        <ClientOnly>
          <vs-pagination
            v-model="currentPage"
            class="pagination"
            color="#0096FF"
            :total="$pagination(products!['count'], currentPage, size)['last_page']"
          />
        </ClientOnly>
      </div>

      <!-- View Detail Dialog -->
      <Modal v-model="activeView" :outside-close="true">
        <h1 class="text-xl text-gray-900 font-semibold">មើលលម្អិតផលិតផល</h1>
        <div class="py-4 space-y-2">
          <!-- Product name -->
          <div class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ឈ្មោះ
            </span>
            <p class="text-base text-gray-800 font-medium">
              {{ product.product.name }}
            </p>
          </div>
          <!-- Product category -->
          <div v-if="product.product.category" class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ប្រភេទផលិតផល
            </span>
            <p class="text-base text-gray-800 font-medium">
              {{ filterCategory(product.product!.category)!.name }}
            </p>
          </div>
          <!-- Product gemstone -->
          <div v-if="product.product.gemstone" class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ប្រភេទត្បូង
            </span>
            <p class="text-base text-gray-800 font-medium">
              {{ filterGemstone(product.product!.gemstone)!.name }}
            </p>
          </div>
          <!-- Product diamonds -->
          <div
            v-if="product.product!.diamonds!.length > 0"
            class="flex items-center gap-5"
          >
            <span
              class="flex-none self-start mt-.5 flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ចំនួនត្បូង
            </span>
            <ul class="w-full flex flex-col gap-y-2">
              <li
                v-for="(diamond, index) in product.product.diamonds"
                :key="index"
                class="w-full flex items-center gap-3 text-base text-gray-700 font-medium"
              >
                <span>ទំហំ: {{ diamond.size }}</span>
                <span>ចំនួន: {{ diamond.quantity }}</span>
              </li>
            </ul>
          </div>
          <!-- Product weight -->
          <div class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ទម្ញន់
            </span>
            <p class="text-base text-gray-800 font-medium">
              {{ product.product.weight }}
            </p>
          </div>
          <!-- Product wages -->
          <div class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ប្រាក់ឈ្នួល
            </span>
            <p class="text-base text-gray-800 font-medium">
              ${{ product.product.wages }}
            </p>
          </div>
          <!-- Product price -->
          <div class="flex items-center gap-5">
            <span
              class="flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              តម្លៃ
            </span>
            <p class="text-base text-gray-800 font-medium">
              ${{ product.product.price }}
            </p>
          </div>
          <!-- Product price -->
          <div
            v-if="product.product.description"
            class="flex items-center gap-5"
          >
            <span
              class="flex-none self-start mt-.5 inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              ការពិពណ៌នា
            </span>
            <p class="text-sm text-gray-600 font-medium">
              {{ product.product.description }}
            </p>
          </div>
          <!-- Product images -->
          <div
            v-if="product.product!.product_images!.length > 0"
            class="flex items-center gap-5"
          >
            <span
              class="self-start mt-.5 flex-none inline-block w-1/4 text-sm text-gray-600 font-medium"
            >
              រូបភាពផលិតផល
            </span>
            <div class="flex items-center flex-wrap gap-2">
              <img
                v-for="(img, i) in product.product.product_images"
                :key="i"
                :src="$storageFile('products/' + img['image_path'])"
                alt=""
                class="w-20 h-auto aspect-square rounded-lg"
              />
            </div>
          </div>
        </div>
      </Modal>

      <!-- Confirm Delete Dialog -->
      <Modal v-model="activeDelete" :outside-close="false">
        <h1 class="text-xl text-gray-900 font-semibold">លុបផលិតផល</h1>
        <div class="py-4">
          <h6 class="text-base text-gray-600 font-medium">
            តើអ្នកប្រាកដថាចង់លុប
            <strong>"{{ product.product.name }}"</strong> មែនទែ?
            <br />
            បញ្ជាក់រាល់ការលុបមិនអាចទាញយកវិញបានទេ
          </h6>
        </div>
        <div class="w-full flex items-center gap-5 pt-5">
          <Button
            class="w-full"
            size="sm"
            color="secondary"
            @click="activeDelete = false"
          >
            បោះបង់
          </Button>
          <Button
            class="w-full"
            size="sm"
            color="danger"
            :loading="ui.isLoading"
            @click="confirmDelete"
          >
            យលព្រម
          </Button>
        </div>
      </Modal>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.slider {
  --slider-connect-bg: #ffd63f;
  --slider-tooltip-bg: #ffd63f;
  --slider-handle-ring-color: #3b82f630;

  --slider-tooltip-color: #333333;
}
</style>
