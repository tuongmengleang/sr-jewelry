<script lang="ts" setup>
import debounce from 'lodash.debounce'
const props = defineProps<{
  modelValue: string
  name: string
  placeholder: string
  debounce: number
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// states
const modelValue = useSyncProps<string>(props, 'modelValue', emit)

/* methods */
const onInput = debounce((e: any) => {
  modelValue.value = e.target.value
}, props.debounce)
</script>

<template>
  <div class="input-wrapper">
    <div class="input-box">
      <div class="input-icon">
        <IconRi:search-2-line />
      </div>
      <input
        id="name"
        class="input"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        @input="onInput($event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  .input-box {
    @apply w-full flex items-center px-3 py-2.5 rounded-xl shadow border-2 border-gray-900/10 text-sm text-gray-700 focus:ring-primary-500;

    .input-icon {
      @apply text-base text-gray-500 mr-2;
    }

    .input {
      @apply w-full outline-0 resize-none;
    }
  }
}
</style>
