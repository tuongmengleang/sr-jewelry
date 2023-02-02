<script lang="ts" setup>
import * as Yup from 'yup'

definePageMeta({
  layout: 'master',
})

const schema = Yup.object().shape({
  name: Yup.string().required('សូមបំពេញឈ្មោះអតិថិជន'),
})

const file = ref(null)

// methods
const onSubmit = (values: object) => {
  console.log('values :', values)
}
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="អតិថិជន" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <div class="grid grid-cols-12 gap-5">
        <div
          class="col-span-12 lg:col-start-2 lg:col-span-8 xl:col-start-3 xl:col-span-6 w-full"
        >
          <Form
            id="createCustomer"
            :validation-schema="schema"
            @submit="onSubmit"
          >
            <div class="w-full flex flex-col gap-y-3">
              <FormUploadProfile v-model="file" />
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
              <Button
                type="submit"
                form="createCustomer"
                class="w-auto ml-auto mt-3"
                >បង្កើត</Button
              >
            </div>
          </Form>
        </div>
      </div>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
