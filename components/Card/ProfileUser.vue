<script lang="ts" setup>
/* props */
const props = defineProps<{
  image: string
  title: string
  subtitle?: string
}>()

/* emit */
const emit = defineEmits(['onClick'])

/* methods */
const onClick = (): void => {
  emit('onClick')
}
</script>

<template>
  <div
    class="relative w-full border-2 border-gray-200 shadow-md shadow-gray-100 rounded-xl p-3"
  >
    <div class="flex items-center gap-4">
      <div
        class="rounded-full p-[3px] bg-gradient-to-r from-cyan-500 to-blue-500"
      >
        <Avatar size="55" class="border-2 border-white">
          <img :src="image" alt="" />
        </Avatar>
      </div>
      <p>
        <span class="block text-xl text-gray-800 font-semibold">
          {{ title }}
        </span>
        <span class="block text-sm text-gray-600 font-medium">
          {{ subtitle }}
        </span>
      </p>
    </div>
    <button
      type="button"
      class="absolute right-2.5 top-2.5 w-6 h-6 bg-gray-200 ring-2 ring-gray-300 rounded-full grid place-items-center transition-all transform duration-200 hover:-translate-y-1.1"
      title="Remove"
      @click="onClick"
    >
      <IconMingcute:close-fill class="text-sm text-gray-500" />
    </button>
  </div>
</template>

<style scoped></style>
