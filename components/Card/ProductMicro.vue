<script lang="ts" setup>
const props = defineProps<{
  image: string
  title: string
  price?: string
}>()

const emit = defineEmits(['onDelete'])

const onClick = () => {
  emit('onDelete')
}
</script>

<template>
  <div class="relative w-full py-3">
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
      </div>
      <div v-if="$slots" class="ml-auto self-end">
        <slot />
      </div>
    </div>
    <!-- Delete Icon -->
    <a
      class="inline-block absolute top-2 right-0 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transform transition-all duration-200 hover:-translate-y-1.1 cursor-pointer"
      @click="onClick"
    >
      <IconWpf:full-trash />
    </a>
  </div>
</template>

<style scoped></style>
