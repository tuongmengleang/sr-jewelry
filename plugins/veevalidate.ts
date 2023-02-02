import { Form, FieldArray, Field, ErrorMessage } from 'vee-validate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Form', Form)
  nuxtApp.vueApp.component('FieldArray', FieldArray)
  nuxtApp.vueApp.component('Field', Field)
  nuxtApp.vueApp.component('ErrorMessage', ErrorMessage)
})
