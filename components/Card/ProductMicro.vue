<script lang="ts" setup>
const props = defineProps<{
  image: string
  title: string
  price?: string
}>()

const number = ref<number>(0)
</script>

<template>
  <div class="w-full py-3">
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
          <span class="float-right text-sm text-red-500 font-medium">
            {{ price }}
          </span>
        </div>
        <vs-input-number v-model="number" class="w-1/3" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
