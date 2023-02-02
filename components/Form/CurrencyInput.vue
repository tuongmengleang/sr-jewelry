<script lang="ts" setup>
import { useCurrencyInput, CurrencyInputOptions } from 'vue-currency-input'
import { useField } from 'vee-validate'
const props: any = defineProps<{
  name: string
  options: CurrencyInputOptions
  label: string
  placeholder: string
}>()

// If the vue-currency-input exposed the numeric value it would be much easier
const { formattedValue, inputRef } = useCurrencyInput(props.options)
const { errorMessage, handleChange } = useField(props.name)

// We can track the formatted value ourselves and sync it with vee-validate as a number when possible
watch(formattedValue, (newValue) => {
  if (newValue === '') {
    handleChange(undefined)
    return
  }

  // otherwise try to parse the number
  const newNumber = Number(newValue)
  // it got formatted so its not a valid number now
  if (Number.isNaN(newNumber)) return

  // sync it with vee-validate, this will trigger validation
  handleChange(newNumber)
  // handleChange(newNumber, false); // doesn't trigger validation
})

const updateValue = (value: any) => {
  formattedValue.value = value
}

defineExpose({
  updateValue,
})
</script>

<template>
  <div class="input-wrapper">
    <label :for="name" class="text-md text-gray-700 font-medium">
      {{ label }}
    </label>
    <div class="input-box" :class="{ error: !!errorMessage }">
      <input
        :id="name"
        ref="inputRef"
        type="text"
        class="input"
        :name="name"
        :value="formattedValue"
        :placeholder="placeholder"
      />
    </div>
    <p v-if="errorMessage" class="text-left text-red-500 text-md font-medium">
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
    }
  }
}
</style>
