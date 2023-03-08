import printJs from 'print-js'
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      printJs(id: string) {
        printJs({
          printable: id,
          type: 'html',
          targetStyles: ['*'],
        })
      },
    },
  }
})
