<script lang="ts" setup>
defineProps<{
  name: string
  size: string
  src: string
}>()

const { $truncateMiddle } = useNuxtApp()
const emit = defineEmits(['onDelete'])

const onDelete = () => {
  emit('onDelete')
}
</script>

<template>
  <div class="flex items-center">
    <img
      class="w-16 h-16 object-cover object-center shadow border rounded-xl"
      :src="src"
      :alt="name"
    />
    <div class="ml-3">
      <h5 class="text-base text-gray-700 font-semibold">
        {{ $truncateMiddle(name) }}
      </h5>
      <span class="text-sm text-gray-500">{{ size }}</span>
    </div>
    <button
      type="button"
      title="លុប"
      class="ml-auto p-1 rounded-full hover:bg-red-200 transform transition-all duration-150 hover:-translate-y-1.2"
      @click="onDelete"
    >
      <IconWpf:full-trash class="text-base text-red-500 font-semibold" />
    </button>
  </div>
</template>

<style scoped></style>
