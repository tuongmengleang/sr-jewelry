<script lang="ts" setup>
import { Grid, html, h } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'
import moment from 'moment'
import useToast from '~/composables/useToast'
import { useUI } from '~/stores/ui'
import { useOrder } from '~/stores/orders'
import { IOrder } from '~/types/IOrder'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'ការបញ្ជាទិញ',
})

/* states */
const { $humanPrice, $profileUrl, $storageFile, $VueHtmlToPaper } = useNuxtApp()
const router = useRouter()
const grid: any = new Grid()
const table = ref<HTMLElement>()
const activeDelete = ref<boolean>(false)
const activeView = ref<boolean>(false)
const activeId = ref<string>('')
const client = useSupabaseClient()
const uiStore = useUI()
const orderStore: any = useOrder()
const range = reactive({
  start: new Date(2020, 0, 1),
  end: new Date(2020, 0, 5),
})

/* mounted */
onMounted(() => {
  renderData()
})

/* methods */
const renderData = (): void => {
  grid.updateConfig({
    columns: [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'លេខសម្គាល់',
        width: '220px',
        formatter: (_, row) =>
          html(`
            <p>${row.cells[1].data}</p>
          `),
      },
      {
        name: 'អតិថិជន',
        width: '220px',
        formatter: (_, row) =>
          html(`
            <div class="w-full flex items-center gap-x-3">
              <div class="flex-none w-10 h-10 rounded-full overflow-hidden">
                  <img class="w-full h-full object-cover object-center" src="${$profileUrl(
                    row.cells[2].data.avatar
                      ? 'customers/' + row.cells[2].data.avatar
                      : ''
                  )}" alt="">
              </div>
              <p>${row.cells[2].data.name}</p>
            </div>
        `),
      },
      {
        name: 'បញ្ជាទិញ',
        width: '250px',
        formatter: (_, row) =>
          html(`
            <div class="flex -space-x-4">
              ${
                row.cells[3].data.length > 0
                  ? row.cells[3].data.map(
                      (order) =>
                        `<img class="w-12 h-12 border-2 border-white rounded-full dark:border-gray-800" src="${$storageFile(
                          order.products.product_images[0].image_path
                            ? 'products/' +
                                order.products.product_images[0].image_path
                            : ''
                        )}" alt="">`
                    )
                  : ''
              }
            </div>
          `),
      },
      {
        name: 'តម្លៃសរុប',
        width: '150px',
        sort: {
          enabled: true,
        },
        formatter: (_, row) =>
          html(`
            <p>
              ${$humanPrice(
                row.cells[3].data
                  .map((item) => item.price)
                  .reduce((a, b) => a + b)
              )}
            </p>
          `),
      },
      {
        name: 'កាលបរិច្ឆេទបញ្ជាទិញ',
        width: '150px',
        formatter: (_, row) =>
          html(`
            <p>${moment(row.cells[4].data).format('D-MMM-YYYY')}</p>
          `),
      },
      {
        name: 'សកម្មភាព',
        sort: {
          enabled: false,
        },
        width: '130px',
        formatter: (cell, row) => {
          return h('div', { class: 'flex items-center gap-3' }, [
            h(
              'button',
              {
                className:
                  'p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all transform duration-150 hover:-translate-y-1 hover:shadow-md',
                title: 'Delete',
                onclick: () => {
                  onDelete(row.cells[0].data)
                },
              },
              html(`
                <svg width="20" height="20" viewBox="0 0 26 26"><path fill="currentColor" d="M10.875 0a1 1 0 0 0-.594.281L5.562 5H3c-.551 0-1 .449-1 1v2c0 .551.449 1 1 1h.25l2.281 13.719a.998.998 0 0 0 0 .062c.163.788.469 1.541 1.032 2.157A3.258 3.258 0 0 0 8.938 26h8.124a3.26 3.26 0 0 0 2.375-1.031c.571-.615.883-1.405 1.032-2.219a.998.998 0 0 0 0-.031L22.78 9H23c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1h-1.563l-2.812-3.5a.813.813 0 0 0-.719-.313a.813.813 0 0 0-.343.125L14.688 3.25L11.717.281A1 1 0 0 0 10.876 0zM11 2.438L13.563 5H8.436L11 2.437zm6.844.656L19.375 5h-2.938l-.593-.594l2-1.312zM5.25 9h.688l1.187 1.188l-1.438 1.406L5.25 9zm2.094 0h.937l-.469.469L7.345 9zm2.312 0h1.688l.906.906l-2 2l-1.75-1.75L9.656 9zm3.125 0h.344l-.156.188L12.78 9zm1.781 0h1.688l1.156 1.156l-1.75 1.75l-2-2.031l.906-.875zm3.063 0h.938l-.47.469L17.626 9zm2.344 0h.812l-.437 2.688l-1.532-1.532L19.97 9zm-7.032 1.594l2.032 2l-2.031 2l-2-2l2-2zm-5.124.281l1.718 1.719l-2 2l-1.625-1.625l-.031-.156l1.938-1.938zm10.28 0l2 2l-1.718 1.75l-2-2.031l1.719-1.719zm-7.843 2.438l2 2l-2 2l-2-2l2-2zm5.406 0l2.031 2l-2 2l-2.03-2l2-2zm4.188 1.25l-.219 1.312l-.563-.563l.782-.75zm-13.657.093l.657.656l-.469.47l-.188-1.126zM7.532 16l2 2l-2 2.031l-.562-.562l-.407-2.5l.97-.969zm5.407 0l2.03 2.031l-2 2L10.939 18l2-2zm5.437 0l1.063 1.063l-.407 2.28l-.656.657l-2-2l2-2zm-8.125 2.719l2 2l-2 2.031l-2-2l2-2.031zm5.406 0l2 2l-2 2l-2-2l2-2zm-8.094 2.718l2 2L9 24h-.063c-.391 0-.621-.13-.874-.406a2.645 2.645 0 0 1-.594-1.188v-.031l-.125-.75l.218-.188zm5.407 0l2 2l-.563.563H11.5l-.563-.563l2.032-2zm5.406 0l.281.282l-.125.656c-.002.01.002.02 0 .031c-.095.49-.316.922-.562 1.188c-.252.27-.509.406-.907.406h-.125l-.562-.563l2-2z"/></svg>
              `)
            ),
            h(
              'button',
              {
                className:
                  'p-1 rounded-full bg-primary-300 hover:bg-primary-400 text-white transition-all transform duration-150 hover:-translate-y-1 hover:shadow-md',
                title: 'View',
                onclick: () => {
                  onView(row.cells[5].data)
                },
              },
              html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16zm0 3a5 5 0 1 1-4.78 3.527A2.499 2.499 0 0 0 12 9.5a2.5 2.5 0 0 0-1.473-2.28A5.01 5.01 0 0 1 12 7z"/></svg>
              `)
            ),
            h(
              'button',
              {
                className:
                  'p-1 rounded-full bg-amber-300 hover:bg-amber-400 text-white transition-all transform duration-150 hover:-translate-y-1 hover:shadow-md',
                title: 'Print',
                onclick: () => {
                  onPrint(row.cells[5].data)
                },
              },
              html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm12-4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3h1a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3ZM8 4h8v2H8Zm8 16H8v-4h8Zm4-5a1 1 0 0 1-1 1h-1v-1a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"/></svg>
              `)
            ),
          ])
        },
      },
    ],
    server: {
      url: '/api/orders',
      then: (data: any) =>
        data.data.map((resp: any) => [
          resp.id,
          resp.order_id,
          resp.customers,
          resp.order_items,
          resp.created_at,
          resp,
        ]),
      total: (data) => data.count,
    },
    pagination: {
      enabled: true,
      limit: 10,
      server: {
        url: (prev, page, limit) => {
          let path = ''
          if (prev.includes('?q')) path = `${prev}&page=${page}&limit=${limit}`
          else path = `${prev}?page=${page}&limit=${limit}`
          return path
        },
      },
    },
    search: {
      server: {
        url: (prev, keyword) => {
          return `${prev}?q=${keyword}`
        },
      },
    },
    width: '100%',
    fixedHeader: true,
    className: {
      td: 'grid-table-td',
      table: 'grid-table',
    },
  })

  grid.render(table.value)
}

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
  grid.updateConfig().forceRender()
}

const onView = (order: IOrder): void => {
  activeView.value = true
  orderStore.setOrder(order)
}

const onPrint = (order: IOrder): void => {
  orderStore.setOrder(order)
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="ការបញ្ជាទិញ" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="relative pb-10">
      <div
        class="w-full flex items-center relative lg:absolute lg:right-0 lg:top-7"
      >
        <NuxtLink :to="{ name: 'orders-create' }" class="ml-auto">
          <Button>
            <IconIc:outline-add-shopping-cart class="text-lg mr-2" />
            បង្កើតការបញ្ជាទិញ
          </Button>
        </NuxtLink>
      </div>
      <!-- Table Order Items -->
      <div class="w-full py-5">
        <div ref="table" class="w-full"></div>
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
      <Modal v-model="activeView" :outside-close="true" size="2xl">
        <h1 class="text-xl text-gray-900 font-semibold">
          ព័ត៌មានលម្អិតនៃការបញ្ជាទិញ
        </h1>
        <div class="py-4">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">ផលិតផល</th>
                  <th scope="col" class="px-6 py-3">ចំនួន</th>
                  <th scope="col" class="px-6 py-3">តម្លៃរាយ</th>
                  <th scope="col" class="px-6 py-3">តម្លៃសរុប</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in orderStore.getOrder.order_items"
                  :key="idx"
                  class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div class="w-[200px] flex items-center gap-3">
                      <img
                        class="w-14 flex-none aspect-square rounded-full object-cover object-center"
                        :src="
                          $storageFile(
                            item.products.product_images[0].image_path
                              ? 'products/' +
                                  item.products.product_images[0].image_path
                              : ''
                          )
                        "
                        alt=""
                      />
                      <p>{{ item.products.name }}</p>
                    </div>
                  </th>
                  <td class="px-6 py-4">{{ item.quantity }}</td>
                  <td class="px-6 py-4">
                    {{ $humanPrice(item.products.price) }}
                  </td>
                  <td class="px-6 py-4">
                    {{ $humanPrice(item.price) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <!-- Invoice Template -->
      <!--      <ClientOnly>-->
      <!--        <html2pdf-->
      <!--          v-if="orderStore.getOrder.order_id"-->
      <!--          ref="html2Pdf"-->
      <!--          :show-layout="true"-->
      <!--          :float-layout="true"-->
      <!--          :enable-download="true"-->
      <!--          :preview-modal="true"-->
      <!--          :paginate-elements-by-height="1400"-->
      <!--          :filename="orderStore.getOrder.customers.name"-->
      <!--          :pdf-quality="2"-->
      <!--          :manual-pagination="false"-->
      <!--          pdf-format="a4"-->
      <!--          pdf-orientation="portrait"-->
      <!--          pdf-content-width="800px"-->
      <!--        >-->
      <!--          <template #pdf-content>-->
      <!--            &lt;!&ndash; PDF Content Here &ndash;&gt;-->
      <!--            <Invoice-->
      <!--              ref="invoiceRef"-->
      <!--              :invoice-no="orderStore.getOrder.order_id"-->
      <!--              :created-at="orderStore.getOrder.created_at"-->
      <!--              :buyer-name="orderStore.getOrder.customers.name"-->
      <!--              :buyer-phone="orderStore.getOrder.customers.phone"-->
      <!--              :order-items="orderStore.getOrder.order_items"-->
      <!--            />-->
      <!--          </template>-->
      <!--        </html2pdf>-->
      <!--      </ClientOnly>-->
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss"></style>
