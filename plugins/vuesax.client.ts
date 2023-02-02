import Vuesax from 'vuesax3'

import 'vuesax3/dist/vuesax.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vuesax)
})
