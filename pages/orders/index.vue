<script lang="ts" setup>
definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'ការបញ្ជាទិញ',
})
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="ការបញ្ជាទិញ" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-10">
      <div class="w-full flex items-center">
        <NuxtLink :to="{ name: 'orders-create' }" class="ml-auto">
          <Button>
            <IconIc:outline-add-shopping-cart class="text-lg mr-2" />
            បង្កើតការបញ្ជាទិញ
          </Button>
        </NuxtLink>
      </div>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
