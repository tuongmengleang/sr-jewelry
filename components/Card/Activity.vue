<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  percentage: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="w-full shadow border border-gray-200 p-4 rounded-xl">
    <div class="flex items-center">
      <slot />
      <h6 class="text-lg text-gray-700 ml-3 font-medium">{{ title }}</h6>
    </div>
    <div class="py-4 text-2xl font-semibold">
      <span>{{ content }}</span>
    </div>
    <div class="text-lg text-primary-600 font-medium">
      <span class="flex items-center gap-x-1">
        {{ percentage > 0 ? '+' : '-' }}{{ percentage }}%
        <!--        <IconIon:arrow-graph-up-right />-->
      </span>
    </div>
  </div>
</template>

<style scoped></style>
