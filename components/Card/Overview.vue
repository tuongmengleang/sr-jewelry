<script lang="ts" setup>
const props = defineProps<{
  text: string
  icon: string
  color?: string
  totalCount: number | string
  isLoading?: boolean
}>()

const colors = reactive<{ [key: string]: string }>({
  primary: 'bg-primary-100 text-primary-600',
  danger: 'bg-red-200 text-red-600',
  green: 'bg-green-100 text-green-600',
  teal: 'bg-teal-100 text-teal-600',
  orange: 'bg-orange-100 text-orange-600',
  sky: 'bg-sky-100 text-sky-600',
})
const selectedColor = computed(() => colors[props.color || colors.primary])
</script>

<template>
  <div class="card-overview">
    <div class="flex items-center gap-x-4">
      <div
        :class="`flex-none w-10 h-10 grid place-items-center rounded-full text-lg ${selectedColor}`"
      >
        <Icon :name="icon" class="text-2xl" />
      </div>
      <h4 class="text-lg text-black font-semibold">{{ text }}</h4>
    </div>
    <div class="flex items-center gap-x-4 pt-3">
      <span
        v-if="isLoading"
        class="w-full h-7 rounded-lg bg-gray-200 animate-pulse"
      ></span>
      <h1 v-else class="ml-auto text-3xl text-black font-semibold">
        {{ totalCount }}
      </h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-overview {
  @apply w-full p-4 bg-white rounded-xl;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
