<script lang="ts" setup>
import { useCurrencyInput } from 'vue-currency-input'
import { watchDebounced } from '@vueuse/core'

const props = defineProps<{
  image: string
  title: string
  price?: string
}>()

const emit = defineEmits(['onDelete', 'onUpdatePrice'])

// States
const isEdit = ref<boolean>(false)
const options = ref<{ currency: string }>({ currency: 'USD' })
const { inputRef, numberValue, setValue }: any = useCurrencyInput(
  options.value,
  false
)
watchDebounced(
  numberValue,
  (value) => (value ? emit('onUpdatePrice', value) : props.price),
  {
    debounce: 0,
  }
)

const onClick = () => {
  emit('onDelete')
}

const startEdit = (): void => {
  isEdit.value = true
  setValue(props.price)
  setTimeout(() => {
    inputRef.value?.focus()
    inputRef.value.value = props.price
  }, 10)
}
</script>

<template>
  <div class="relative w-full py-3">
    <div class="flex items-center">
      <div
        class="flex-none w-20 aspect-square border border-gray-200 shadow shadow-gray-300 rounded-lg overflow-hidden"
      >
        <img
          class="w-full h-full object-center object-cover"
          :src="image"
          :alt="title"
        />
      </div>
      <div class="w-full ml-3 self-start">
        <div class="truncate text-lg text-gray-700 font-medium">
          {{ title }}
        </div>
        <div class="w-full flex items-center">
          <input
            v-if="isEdit"
            ref="inputRef"
            class="input-ref"
            type="text"
            @blur="isEdit = false"
            @keydown.enter="isEdit = false"
          />
          <span
            v-else
            class="float-right text-sm text-red-500 font-medium"
            @click="startEdit"
          >
            {{ price }}
          </span>
        </div>
      </div>
      <div v-if="$slots" class="ml-auto self-end">
        <slot />
      </div>
    </div>
    <!-- Delete Icon -->
    <a
      class="inline-block absolute top-2 right-0 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transform transition-all duration-200 hover:-translate-y-1.1 cursor-pointer"
      @click="onClick"
    >
      <IconWpf:full-trash />
    </a>
  </div>
</template>

<style lang="scss" scoped>
.input-ref {
  @apply border-b border-red-400 text-red-600 text-sm;
}
</style>
