<script lang="ts" setup>
/* imports */
import { useField } from 'vee-validate'
import { PropType } from 'vue'
import { IProductCategory } from '~/types/IProduct'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  items: {
    type: Array as PropType<Array<IProductCategory>>,
    default: () => [],
  },
  name: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Label',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(props.name, undefined, { initialValue: props.value })

handleChange(props.value)

// watch(value, (newValue: any) => {
//   console.log({ newValue })
// })

const onChange = (evt: Event): void => {
  handleChange((evt.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="input-wrapper">
    <label :for="name" class="text-md text-gray-700 font-medium">
      {{ label }}
    </label>
    <div
      class="input-box"
      :class="{ error: !!errorMessage, success: meta.valid }"
    >
      <select
        :id="name"
        :name="name"
        :value="inputValue"
        class="input"
        @change="onChange($event)"
      >
        <option value="">--- សូមជ្រើសរើស ---</option>
        <option v-for="(item, i) in items" :key="i" :value="item?.value">
          {{ item?.name }}
        </option>
      </select>
    </div>
    <p
      v-if="errorMessage && meta.touched"
      class="text-left text-red-500 text-md font-medium"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  .input-box {
    @apply w-full px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/20 text-md text-gray-900 focus:ring-primary-500;
    &.error {
      @apply border-red-500 shadow-red-400;
    }
    .input {
      @apply w-full bg-transparent;
    }
  }
}
</style>
