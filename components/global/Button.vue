<script lang="ts" setup>
import { PropType } from 'vue'

type KindType = 'reset' | 'submit' | 'button'
const props = defineProps({
  type: {
    type: String as PropType<KindType>,
    default: 'button',
  },
  form: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  hoverAnimate: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const defaultStyle = `
  relative box-border relative inline-flex items-center justify-center overflow-hidden font-bold text-white transition-all duration-300 rounded-md cursor-pointer group ring-offset-2 ring-1 ease focus:outline-none
`
const styles = reactive<{
  [key: string]: string
}>({
  primary: `!text-gray-100 ${
    !props.bordered ? 'bg-primary' : 'bg-transparent'
  } ${
    props.disabled
      ? '!bg-gray-300 border-gray-400 !text-gray-400 ring-gray-300 ring-offset-gray-200 hover:ring-offset-gray-400 pointer-events-none'
      : 'border-primary-400 ring-primary-300 ring-offset-primary-200 hover:ring-offset-primary-400'
  } hover:bg-primary-400 transition-all ${
    props.hoverAnimate
      ? 'transform duration-75 hover:-translate-y-0.75 hover:shadow-lg shadow-primary-300'
      : ''
  }`,
  secondary: `text-gray-600 ${
    !props.bordered ? 'bg-gray-300' : 'bg-transparent'
  } hover:bg-gray-200 border-gray-200 ring-gray-200 ring-offset-gray-200 hover:ring-offset-gray-200`,
  danger: `text-white ${
    !props.bordered ? 'bg-red-600' : 'bg-transparent'
  } hover:bg-red-500 border-red-500 ring-red-300 ring-offset-red-200 hover:ring-offset-red-500`,
})

const sizes = reactive<{
  [key: string]: string
}>({
  lg: 'h-12 px-8 text-lg',
  md: 'h-10 px-6 text-base',
  sm: 'h-8 px-4 text-sm',
  xs: 'h-6 px-3 text-xs',
})

const selectedStyle = computed(() => styles[props.color] || styles.primary)
const selectedSize = computed(() => sizes[props.size] || sizes.lg)
</script>

<template>
  <button
    :type="props.type"
    :form="props.form"
    :class="`${defaultStyle} ${selectedStyle} ${selectedSize}`"
    :disabled="props.loading || props.disabled"
  >
    <span
      class="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"
    ></span>
    <span
      class="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"
    ></span>
    <span class="relative z-20 flex items-center text-sm">
      <slot v-if="!loading" />
      <svg v-else class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
    </span>
  </button>
</template>

<style scoped lang="scss">
.spinner {
  position: relative;
  width: 30px;
  height: 30px;
  z-index: 2;
  animation: rotate 2s linear infinite;

  & .path {
    stroke: white;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
