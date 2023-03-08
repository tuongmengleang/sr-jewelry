<script lang="ts" setup>
/* imports */
import moment from 'moment'
import html2canvas from 'html2canvas'
import { useUI } from '~/stores/ui'
import { useOrder } from '~/stores/orders'
import useToast from '~/composables/useToast'
import { IOrder } from '~/types/IOrder'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

/* States */
const {
  $profileUrl,
  $storageFile,
  $humanPrice,
  $pagination,
  $getDateRangeByKeyword,
  $printJs,
  $downloadImage,
} = useNuxtApp()
const uiStore = useUI()
const orderStore: any = useOrder()
const client = useSupabaseClient()
const currentPage = ref<number>(1)
const page = ref<number>(0)
const size = ref<number>(10)
const searchText = ref<string>('')
const date = ref<string[]>(['', ''])
const activeDelete = ref<boolean>(false)
const activeView = ref<boolean>(false)
const activeId = ref<string>('')
const invoiceRef = ref<HTMLElement | null>(null)

/* watch */
watch([currentPage, searchText, date], ([newValue]) => {
  currentPage.value = newValue
  page.value = newValue - 1
  refresh()
})

/* Fetching Data */
const { data, error, pending, refresh } = await useAsyncData('count', () =>
  $fetch('/api/orders', {
    params: {
      q: searchText.value,
      page: page.value,
      limit: size.value,
      startDate: date.value ? date.value[0] : null,
      endDate: date.value ? date.value[1] : null,
    },
  })
)

const onDelete = (id: string): void => {
  activeDelete.value = true
  activeId.value = id
}

const onConfirmDelete = async (): Promise<any> => {
  uiStore.updateIsLoading(true)
  const { data, error } = await client
    .from('orders')
    .delete()
    .eq('id', activeId.value)

  if (error) useToast().error('មានអ្វីមួយមិនប្រក្រតី សូមព្យាយាមម្ដងទៀត!')
  activeDelete.value = false
  uiStore.updateIsLoading(false)
  refresh()
}

const onView = (order: IOrder): void => {
  activeView.value = true
  orderStore.setOrder(order)
}

const onPrint = (): void => {
  $printJs('invoiceRef')
}

const onDownload = (): void => {
  const element: any = document.getElementById('invoiceRef')
  html2canvas(element, { useCORS: true }).then((canvas) => {
    const dataURL = canvas.toDataURL()
    $downloadImage(dataURL)
  })
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="ការបញ្ជាទិញ" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="relative pb-10">
      <div class="flex flex-col md:flex-row items-center gap-5 my-5">
        <!-- Filter by Customer Name -->
        <FormSearchInput
          v-model="searchText"
          class="w-70 md:w-60 self-start"
          name="search"
          placeholder="ស្វែងរកតាមរយះឈ្មោះអតិថិជន"
          :debounce="1500"
        />
        <!-- Filter by Date -->
        <div class="w-70 md:w-60 lg:w-1/5 self-start">
          <FilterDate v-model="date" />
        </div>
        <NuxtLink :to="{ name: 'orders-create' }" class="self-start md:ml-auto">
          <Button>
            <IconIc:outline-add-shopping-cart class="text-lg mr-2" />
            បង្កើតការបញ្ជាទិញ
          </Button>
        </NuxtLink>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div
          v-if="pending"
          class="absolute w-full h-full bg-gray-300/60 animate-pulse z-20 grid place-items-center"
        >
          <p>Loading...</p>
        </div>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 w-[20%]">លេខសម្គាល់</th>
              <th scope="col" class="px-6 py-3 w-[20%]">អតិថិជន</th>
              <th scope="col" class="px-6 py-3 w-[30%]">បញ្ជាទិញ</th>
              <th scope="col" class="px-6 py-3 w-[10%]">តម្លៃសរុប</th>
              <th scope="col" class="px-y py-3 w-[10%]">កាលបរិច្ឆេទបញ្ជាទិញ</th>
              <th scope="col" class="px-6 py-3 w-[10%]">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody v-if="data.data && data.data.length > 0">
            <tr
              v-for="item in data.data"
              :key="item.id"
              class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
            >
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                {{ item.order_id }}
              </th>
              <td class="px-6 py-2">
                <div class="flex items-center gap-3">
                  <img
                    class="w-10 flex-none aspect-square rounded-full object-cover object-center"
                    :src="
                      $profileUrl(
                        item.customers.avatar
                          ? 'customers/' + item.customers.avatar
                          : ''
                      )
                    "
                    :alt="item.customers.name"
                  />
                  <p class="w-30 text-sm font-medium text-gray-700">
                    {{ item.customers.name }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-2">
                <div class="flex -space-x-4 min-w-40">
                  <img
                    v-for="(order, idx) in item.order_items"
                    :key="idx"
                    class="w-12 h-12 border-2 border-white rounded-full dark:border-gray-800"
                    :src="
                      $storageFile(
                        order.products.product_images[0].image_path
                          ? 'products/' +
                              order.products.product_images[0].image_path
                          : ''
                      )
                    "
                    :alt="order.products.name"
                  />
                </div>
              </td>
              <td class="px-6 py-2">
                {{
                  $humanPrice(
                    item.order_items
                      .map((item) => item.price)
                      .reduce((a, b) => a + b)
                  )
                }}
              </td>
              <td class="px-6 py-2">
                <div class="w-[150px]">
                  <p>{{ moment(item.created_at).format('D-MMM-YYYY') }}</p>
                </div>
              </td>
              <td class="px-6 py-2 text-right">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all transform duration-150 hover:-translate-y-1 hover:shadow-md"
                    title="Delete"
                    @click="onDelete(item.id)"
                  >
                    <IconWpf:full-trash />
                  </button>
                  <button
                    type="button"
                    class="p-1 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all transform duration-150 hover:-translate-y-1 hover:shadow-md"
                    title="View"
                    @click="onView(item)"
                  >
                    <IconRi:eye-2-line />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6">
                <div class="w-full py-3 text-center">
                  <p class="text-base font-medium text-gray-700">
                    មិនមានទិន្នន័យសម្រាប់បង្ហាញ
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="data" class="pt-5 z-10">
        <ClientOnly>
          <vs-pagination
            v-model="currentPage"
            class="pagination"
            color="#0096FF"
            :total="$pagination(data.count, currentPage, size)['last_page']"
          />
        </ClientOnly>
      </div>

      <!-- Modal Confirm Delete -->
      <Modal v-model="activeDelete" :outside-close="false">
        <h1 class="text-xl text-gray-900 font-semibold">លុបការបញ្ជាទិញ</h1>
        <div class="py-4">
          <h6 class="text-base text-gray-600 font-medium">
            តើអ្នកប្រាកដថាចង់លុបមែនទែ? បញ្ជាក់រាល់ការលុបមិនអាចទាញយកវិញបានទេ
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
            :loading="uiStore.isLoading"
            @click="onConfirmDelete"
          >
            យលព្រម
          </Button>
        </div>
      </Modal>

      <!-- Modal View -->
      <Modal v-model="activeView" :outside-close="true" size="a4">
        <h1 v-if="false" class="text-xl text-gray-900 font-semibold">
          ព័ត៌មានលម្អិតនៃការបញ្ជាទិញ
        </h1>
        <div class="w-full h-full overflow-auto">
          <Invoice
            v-if="orderStore.getOrder && orderStore.getOrder.order_id"
            id="invoiceRef"
            ref="invoiceRef"
            :invoice-no="orderStore.getOrder.order_id"
            :created-at="orderStore.getOrder.created_at"
            :buyer-name="orderStore.getOrder.customers.name"
            :buyer-phone="orderStore.getOrder.customers.phone"
            :order-items="orderStore.getOrder.order_items"
          />
          <div class="fixed bottom-0 right-0">
            <div class="w-full flex items-center p-5">
              <Button
                size="sm"
                class="ml-4 flex items-center"
                @click="onDownload"
              >
                <IconMingcute:download-3-line class="mr-2" />
                ទាញយក
              </Button>
              <Button
                size="sm"
                class="ml-4 flex items-center"
                color="danger"
                @click="onPrint"
              >
                <IconMingcute:print-line class="mr-2" />
                បោះពុម្ព
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
