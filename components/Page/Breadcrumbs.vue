<script lang="ts" setup>
const route = useRoute()
const crumbs = computed(() => {
  const fullPath = route.fullPath
  const params = fullPath.substring(1).split('/')
  params.unshift('dashboard')
  return params
})
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center gap-x-2">
      <li
        v-for="(item, i) in crumbs"
        :key="i"
        class="inline-flex items-center"
        aria-current="page"
      >
        <IconIc:round-keyboard-arrow-right
          v-if="i !== 0"
          class="text-xl text-gray-400 mr-1"
        />
        <span
          v-if="i - crumbs.length === -1"
          class="inline-flex items-center text-sm text-gray-500 font-medium text-gray-700 capitalize"
        >
          {{ item }}
        </span>
        <NuxtLink
          v-else
          :to="
            route.name === item ? '' : item === 'dashboard' ? '/' : `/${item}`
          "
          class="inline-flex items-center text-sm font-medium text-gray-700 capitalize hover:text-blue-600"
        >
          {{ item }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped></style>
