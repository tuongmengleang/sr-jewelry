<script lang="ts" setup>
/* import */
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import moment from 'moment'

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
const date = ref()

/* watch */
watch(date, (newValue) => {
  active.value = ''
  modelValue.value = [
    moment(newValue.start).format('YYYY/MM/DD'),
    moment(newValue.end).format('YYYY/MM/DD'),
  ]
})

/* mounted */
onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
  date.value = [startDate, endDate]
})

/* methods */
const changeDateRange = (keyword: string, close: any) => {
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
        class="absolute lg:left-0 z-50 mt-1.5 w-md bg-white border shadow-lg rounded-xl"
      >
        <div class="grid grid-cols-12">
          <ul class="p-3 col-span-3">
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
          <div class="col-span-9 py-4 pr-5">
            <DatePicker
              v-model="date"
              is-expanded
              title-position="left"
              is-range
            />
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<style lang="scss">
.dp__theme_light {
  --dp-menu-border-color: transparent;
}
.dp__button {
  display: none !important;
}
.vc-container {
  border: none;
}
</style>
