import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Splide', Splide)
  nuxtApp.vueApp.component('SplideSlide', SplideSlide)
})
