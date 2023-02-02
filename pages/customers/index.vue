<script lang="ts" setup>
import { Grid, html } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'
import { useCustomer } from '~/stores/customer'

definePageMeta({
  layout: 'master',
})

const table = ref(null)
const { customers } = useCustomer()

onMounted(() => {
  if (!table.value) return

  const grid = new Grid({
    columns: [
      {
        name: 'រូបភាព',
        formatter: (_, row) =>
          html(`
            <div class="w-10 h-10 flex-none rounded-full mx-auto">
              <img class="w-full h-full rounded-full object-cover shadow-xl" src="${row.cells[0].data}" alt="${row.cells[1].data}"/>
            </div>
          `),
        width: '10%',
      },
      {
        name: 'ឈ្មោះ',
        width: '20%',
        sort: {
          enabled: true,
        },
      },
      {
        name: 'លេខទូរសព្ទ',
        width: '20%',
      },
      {
        name: 'អាស័យដ្ឋាន',
        width: '50%',
      },
    ],
    data: customers.map((x) => [x.profile_image, x.name, x.phone, x.address]),
    search: true,
    pagination: {
      enabled: true,
      limit: 10,
      summary: false,
    },
  }).render(table.value)
})
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="អតិថិជន" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <div class="flex items-center">
        <NuxtLink :to="{ name: 'customers-create' }" class="ml-auto">
          <Button>
            <IconMi:user-add class="text-lg mr-2" />
            បង្កើត
          </Button>
        </NuxtLink>
      </div>

      <!-- Table Customer -->
      <div ref="table" class="table"></div>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.table {
  @apply w-full overflow-auto;
}
</style>
