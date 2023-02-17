<script lang="ts" setup>
/* imports */
import * as Yup from 'yup'
import { Grid, html, h } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'
import { useCustomer } from '~/stores/customer'
import { ICustomer } from '~/types/ICustomer'
import useToast from '~/composables/useToast'
import { useUI } from '~/stores/ui'

/* page meta */
definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

/* head meta */
useHead({
  title: 'បញ្ជីអតិថិជន',
})

/* schema validate */
const schema = Yup.object().shape({
  name: Yup.string().required('សូមបំពេញឈ្មោះអតិថិជន'),
})

/* states */
const { $profileUrl } = useNuxtApp()
const grid: any = new Grid()
const customer: any = useCustomer()
const table: any = ref<HTMLElement>()
const activeCreate = ref<boolean>(false)
const activeDelete = ref<boolean>(false)
const myForm: any = ref<HTMLElement>()
const ui = useUI()
const profileUpload: any = ref<HTMLElement>()

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
        name: 'រូបភាព',
        sort: {
          enabled: false,
        },
        formatter: (_, row) =>
          html(`
            <div class="w-10 h-10 flex-none mx-auto shadow-md shadow-gray-400 rounded-full">
              <img class="w-full h-full rounded-xl object-cover" src="${$profileUrl(
                row.cells[1].data ? 'customers/' + row.cells[1].data : ''
              )}" alt="${row.cells[2].data}">
            </div>
          `),
        width: '100px',
      },
      {
        name: 'ឈ្មោះ',
        width: '200px',
        sort: {
          enabled: true,
        },
      },
      {
        name: 'អុីម៉ែល',
        width: '200px',
        sort: {
          enabled: false,
        },
      },
      {
        name: 'អាសយដ្ឋាន',
        width: '200px',
        sort: {
          enabled: false,
        },
        formatter: (_, row) =>
          html(`
            <p class="truncate">${
              row.cells[4].data ? row.cells[4].data : ''
            }</p>
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
                onclick: () => {
                  onDelete(
                    row.cells[0].data,
                    row.cells[2].data,
                    row.cells[1].data
                  )
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
                onclick: () => {
                  onEdit(
                    row.cells[0].data,
                    row.cells[1].data,
                    row.cells[2].data,
                    row.cells[3].data,
                    row.cells[4].data
                  )
                },
              },
              html(`
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>
              `)
            ),
          ])
        },
      },
    ],
    server: {
      url: '/api/customers',
      then: (data: any) =>
        data.data.map((customer: ICustomer) => [
          customer.id,
          customer.avatar,
          customer.name,
          customer.phone,
          customer.address,
        ]),
      total: (data) => data.count,
    },
    pagination: {
      enabled: true,
      limit: 9,
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

const onCreate = (): void => {
  activeCreate.value = true
  customer.clearCustomer()
}

const onSubmit = async (values: any, actions: any): Promise<void> => {
  ui.updateIsLoading(true)
  if (customer.customer.file) {
    // If it has id => Update
    if (customer.customer.id && customer.customer.avatar)
      await customer.removeImage(customer.customer.avatar)
    const { data, error } = await customer.uploadImage(
      customer.customer.file,
      customer.customer.file.name
    )
    if (error) useToast().error('មានអ្វីមួយមិនប្រក្រតី សូមព្យាយាមម្ដងទៀត!')
    else {
      await useFetch(
        `/api/customers/${customer.customer.id ? customer.customer.id : ''}`,
        {
          method: customer.customer.id ? 'PUT' : 'POST',
          body: {
            name: values.name,
            phone: values.phone,
            address: values.address,
            avatar: data.path,
          },
        }
      )
    }
  } else {
    await useFetch(
      `/api/customers/${customer.customer.id ? customer.customer.id : ''}`,
      {
        method: customer.customer.id ? 'PUT' : 'POST',
        body: {
          name: values.name,
          phone: values.phone,
          address: values.address,
          avatar: customer.customer.avatar || '',
        },
      }
    )
  }
  useToast().success(
    customer.customer.id ? 'កែប្រែអតិថិជនជោគជ័យ' : 'បង្កើតអតិថិជនជោគជ័យ'
  )
  actions.resetForm({
    values: {
      name: '',
      phone: '',
      address: '',
    },
  })
  customer.removeCustomerFile()
  profileUpload.value.onClear()
  ui.updateIsLoading(false)
  activeCreate.value = false
  grid.updateConfig().forceRender()
}

const onEdit = (id, avatar, name, phone, address): void => {
  activeCreate.value = true
  customer.updateCustomerByProperty('avatar', avatar)
  customer.updateCustomerByProperty('id', id)
  setTimeout(() => {
    myForm.value.setValues({
      name,
      phone,
      address,
    })
  }, 100)
}

const onDelete = (id: any, name: any, avatar: any): void => {
  customer.updateCustomer({ id, name, avatar })
  activeDelete.value = true
}

const onConfirmDelete = async (): Promise<void> => {
  ui.updateIsLoading(true)
  const { data, error } = await useFetch(
    `/api/customers/${customer.customer.id}`,
    {
      method: 'DELETE',
      body: {
        avatar: customer.customer.avatar,
      },
    }
  )
  if (error.value) useToast().error('មានអ្វីមួយមិនប្រក្រតី សូមព្យាយាមម្ដងទៀត!')
  activeDelete.value = false
  ui.updateIsLoading(false)
  grid.updateConfig().forceRender()
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="អតិថិជន" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <div class="flex items-center">
        <Button class="ml-auto" @click="onCreate">
          <IconMi:user-add class="text-lg mr-2" />
          បង្កើតអតិថិជន
        </Button>
      </div>

      <!-- Table Customer -->
      <div class="w-full py-5">
        <div ref="table" class="w-full"></div>
      </div>

      <!-- Modal Create -->
      <Modal v-model="activeCreate">
        <!-- Modal-Head -->
        <div class="flex items-center justify-between">
          <div class="text-lg text-gray-800 font-medium">បង្កើតអតិថិជន</div>
          <button
            type="button"
            class="w-7 h-7 grid place-items-center rounded-full bg-gray-200 shadow shadow-gray-400 transform transition-all duration-200 hover:-translate-y-1.2"
            title="Close"
            @click="activeCreate = false"
          >
            <IconMingcute:close-circle-line class="text-lg text-gray-500" />
          </button>
        </div>
        <div class="w-full h-[1px] bg-gray-200 my-5"></div>

        <!-- Modal-Body -->
        <Form
          id="createCustomerForm"
          ref="myForm"
          :validation-schema="schema"
          @submit="onSubmit"
        >
          <div class="w-full flex flex-col gap-y-3">
            <FormUploadProfile
              ref="profileUpload"
              v-model="customer.customer.file"
              :preview="
                customer.customer.avatar
                  ? $profileUrl('customers/' + customer.customer.avatar)
                  : ''
              "
            />
            <FormInput
              name="name"
              type="text"
              label="ឈ្មោះ"
              placeholder="ម៉េងលាង"
              error-message="សូមបំពេញឈ្មោះ"
            />
            <FormInput
              name="phone"
              type="text"
              label="លេខទូរសព្ទ"
              placeholder="012 345 6789"
            />
            <FormInput
              name="address"
              type="textarea"
              label="អាស័យដ្ឋាន"
              placeholder="ខ័ណ្ឌមានជ័យ ភ្នំពេញ"
            />
          </div>
          <Button
            type="submit"
            form="createCustomerForm"
            class="w-auto ml-auto float-right mt-3"
            :loading="ui.isLoading"
          >
            {{ customer.customer.id ? 'កែប្រែ' : 'បង្កើត' }}
          </Button>
        </Form>
      </Modal>

      <!-- Modal Delete -->
      <Modal v-model="activeDelete" :outside-close="false">
        <h1 class="text-xl text-gray-900 font-semibold">លុបអតិថិជន</h1>
        <div class="py-4">
          <h6 class="text-base text-gray-600 font-medium">
            តើអ្នកប្រាកដថាចង់លុប
            <strong>"{{ customer!.customer!.name }}"</strong> មែនទែ?
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
            @click="onConfirmDelete"
          >
            យលព្រម
          </Button>
        </div>
      </Modal>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss">
.grid-table {
  @apply w-full overflow-auto;
}
</style>
