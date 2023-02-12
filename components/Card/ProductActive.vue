<script lang="ts" setup>
const props = defineProps<{
  image: string
  title: string
  price?: string
  isActive?: boolean
}>()
</script>

<template>
  <div
    :class="[
      isActive ? 'border-2 border-primary' : 'border-2 border-transparent',
      'w-full relative rounded-xl cursor-pointer',
    ]"
  >
    <div class="w-full aspect-square">
      <img
        class="w-full h-full object-center object-cover rounded-xl"
        :src="image"
        :alt="title"
      />
    </div>
    <div class="p-2">
      <div class="truncate text-base text-gray-700 font-medium">
        {{ title }}
      </div>
      <span class="text-sm text-red-500 font-medium">{{ price }}</span>
    </div>
    <div
      v-if="isActive"
      class="absolute -top-2 -left-2 p-.5 bg-white rounded-full"
    >
      <IconIc:round-check-circle class="text-primary text-lg" />
    </div>
  </div>
</template>

<style scoped></style>
