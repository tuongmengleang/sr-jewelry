<script lang="ts" setup>
/* imports */
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'

definePageMeta({
  layout: 'master',
  middleware: 'auth',
})

useHead({
  title: 'បង្កើតការបញ្ជាទិញ',
})

/* states */
const state: any = reactive({
  customers: [
    {
      name: 'យ៉ន ចិត្រ្តា',
      avatar:
        'https://i.pinimg.com/564x/da/0c/b7/da0cb713319e97568d8cff1ce1377abb.jpg',
    },
    {
      name: 'លន សុទ្ធាណា',
      avatar:
        'https://i.pinimg.com/236x/41/5e/1d/415e1df3bd4f7432a4b71264375aaa52.jpg',
    },
    {
      name: 'ចេន ម៉េងហ៊ួរ',
      avatar:
        'https://i.pinimg.com/236x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg',
    },
    {
      name: 'ប្រាក់ សុធិ',
      avatar:
        'https://i.pinimg.com/236x/77/d0/46/77d046216aed031dae02543b9ee2ac79.jpg',
    },
  ],
})
const selected = ref(state.customers[0])
const query = ref<string>('')
const filteredCustomer = computed(() =>
  query.value === ''
    ? state.customers
    : state.customers.filter((person) => {
        return person.name.toLowerCase().includes(query.value.toLowerCase())
      })
)
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="បង្កើតការបញ្ជាទិញ" />
      <PageBreadcrumbs />
    </PageHeader>
    <PageBody class="pb-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-7">
        <div class="w-full">
          <label class="text-base text-gray-800 font-medium">អតិថិជន</label>
          <Combobox v-model="selected">
            <div class="relative mt-1 lg:w-1/2">
              <div
                class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <ComboboxInput
                  class="w-full px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/20 text-md text-gray-900 focus:ring-primary-500"
                  :display-value="(customer: any) => customer.name"
                  @change="query = $event.target.value"
                >
                </ComboboxInput>
              </div>
              <TransitionRoot
                leave="transition ease-in duration-100"
                leave-from="opacity-100"
                leave-to="opacity-0"
                @after-leave="query = ''"
              >
                <ComboboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <div
                    v-if="filteredCustomer.length === 0 && query !== ''"
                    class="relative cursor-default select-none py-2 px-4 text-gray-700"
                  >
                    Nothing found.
                  </div>
                  <ComboboxOption
                    v-for="(customer, idx) in filteredCustomer"
                    :key="idx"
                    v-slot="{ selected, active }"
                    as="template"
                    :value="customer"
                    class="p-2"
                  >
                    <li
                      :class="[
                        active ? 'bg-gray-200' : '',
                        'flex items-center gap-3 relative cursor-default select-none py-2 px-3',
                      ]"
                    >
                      <img
                        class="w-10 h-10 rounded-full shadow shadow-gray-300"
                        :src="customer.avatar"
                        :alt="customer.name"
                      />
                      <div class="flex flex-col">
                        <span
                          class="block truncate text-base text-gray-700 font-medium"
                          :class="{
                            'font-medium': selected,
                            'font-normal': !selected,
                          }"
                        >
                          {{ customer.name }}
                        </span>
                        <span class="block truncate text-sm text-gray-500"
                          >096 825 5313</span
                        >
                      </div>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </div>
          </Combobox>
        </div>
      </div>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
