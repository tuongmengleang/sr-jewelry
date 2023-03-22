<script lang="ts" setup>
defineProps<{
  title: string
  images: []
  status: string
  price: string
}>()

const { $storageFile } = useNuxtApp()
</script>

<template>
  <div class="card-container w-full relative">
    <div class="card-header relative w-full">
      <div class="relative w-full h-auto aspect-square">
        <Splide
          v-if="images.length > 0"
          :options="{ rewind: true, arrows: false }"
          aria-label="My Favorite Images"
        >
          <SplideSlide v-for="(img, i) in images" :key="i">
            <img
              class="w-full max-h-64 object-cover object-center"
              :src="$storageFile('products/' + img['image_path'])"
              :alt="title"
            />
          </SplideSlide>
        </Splide>
        <img
          v-else
          class="w-full h-full object-cover"
          src="~/assets/images/placeholder.jpg"
          alt="placeholder"
        />
      </div>
      <div class="dropdown-content absolute top-2 right-2">
        <slot name="dropdown" />
      </div>
    </div>
    <div class="p-3">
      <h6 class="text-sm text-gray-700 font-medium truncate">{{ title }}</h6>
      <span
        class="hidden bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded"
      >
        {{ status }}
      </span>
      <p class="text-xs text-red-500 font-medium mt-1">{{ price }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  .card-header {
    &:hover {
      .dropdown-content {
        @apply block;
      }
    }
    .dropdown-content {
      @apply block lg:hidden;
    }
  }
}
</style>
