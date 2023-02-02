<script lang="ts" setup>
import { useField } from 'vee-validate'

const props = defineProps({
  value: {
    type: [Number, String],
    default: '',
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
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
})

/* methods */
const onInput = (event: KeyboardEvent) => {
  event = event || window.event
  const charCode = event?.which ? event?.which : event?.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) event.preventDefault()
  return true
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
      <input
        :id="name"
        type="number"
        :name="name"
        :value="inputValue"
        :placeholder="placeholder"
        class="input"
        @keypress="onInput($event)"
        @blur="handleBlur"
        @input="handleChange"
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

<style scoped lang="scss">
.input-wrapper {
  .input-box {
    @apply w-full px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/20 text-md text-gray-900 focus:ring-primary-500;
    &.error {
      @apply border-red-500 shadow-red-400;
    }
    .input {
      @apply w-full outline-0 resize-none;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      &[type='number'] {
        -moz-appearance: textfield;
      }
    }
  }
}
</style>
