<script lang="ts" setup>
import { useField } from 'vee-validate'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
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
  size: {
    type: String,
    default: 'md',
  },
})

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
})
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
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="name"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :value="inputValue"
        :cols="type === 'textarea' ? 30 : null"
        :rows="type === 'textarea' ? 3 : null"
        class="input"
        @input="handleChange"
        @blur="handleBlur"
      />
    </div>
    <p
      v-if="errorMessage && meta.touched"
      class="text-left text-red-500 text-md font-medium"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  .input-box {
    @apply w-full px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/20 text-md text-gray-900 focus:ring-primary-500;
    &.error {
      @apply border-red-500 shadow-red-400;
    }
    .input {
      @apply w-full outline-0 resize-none;
    }
  }
}
</style>
