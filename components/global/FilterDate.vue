<script lang="ts" setup>
/* import */
import moment from 'moment'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

/* props */
const props = defineProps<{
  modelValue: string[]
}>()
/* emit */
const emit = defineEmits(['update:modelValue'])
/* states */
const { $getDateRangeByKeyword } = useNuxtApp()
const modelValue = useSyncProps<string[]>(props, 'modelValue', emit)
const dateRanges = [
  { value: 'this-week', name: 'សប្តាហ៍នេះ' },
  { value: 'last-week', name: 'សប្ដាហ៍មុន' },
  { value: 'this-month', name: 'ខែនេះ' },
  { value: 'this-year', name: 'ឆ្នាំនេះ' },
  { value: 'last-year', name: 'ឆ្នាំមុន' },
  { value: 'all-time', name: 'គ្រប់ពេល' },
]
const active = ref<string>('')

/* methods */
const changeDateRange = (keyword: string, close: any) => {
  console.log('keyword :', keyword)
  modelValue.value = $getDateRangeByKeyword(keyword)
  active.value = keyword
  close()
}
</script>

<template>
  <Popover v-slot="{ open }" class="relative cursor-pointer">
    <PopoverButton
      class="w-full flex items-center px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/10 text-sm text-gray-700 focus:ring-primary-500"
    >
      <input
        id="name"
        :value="modelValue[0] ? `${modelValue[0]} - ${modelValue[1]}` : ''"
        class="w-full outline-0 resize-none cursor-pointer"
        type="text"
        autocomplete="off"
        readonly
        placeholder="ត្រងតាមកាលបរិច្ឆេទ"
      />
      <a
        :class="[
          open ? 'rotate-180' : 'rotate-0',
          'text-lg text-gray-500 transform-gpu transition-all duration-200',
        ]"
      >
        <IconIc:round-keyboard-arrow-down />
      </a>
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
        v-slot="{ close }"
        class="absolute right-0 z-50 mt-1.5 w-full bg-white border shadow-lg rounded-xl"
      >
        <div class="grid grid-cols-1">
          <ul class="p-3">
            <li
              v-for="(item, idx) in dateRanges"
              :key="idx"
              :class="[
                active === item.value ? 'bg-primary-300 text-white' : '',
                'px-2 py-1.5 hover:bg-gray-100 rounded-lg text-sm text-gray-900 font-medium',
              ]"
              @click="changeDateRange(item.value, close)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<style lang="scss" scoped></style>
