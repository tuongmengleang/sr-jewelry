import VueTailwindPagination from '@ocrv/vue-tailwind-pagination'
import '@ocrv/vue-tailwind-pagination/styles'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Pagination', VueTailwindPagination)
})
