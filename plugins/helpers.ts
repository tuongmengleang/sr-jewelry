// @ts-ignore
import placeholder from '~/assets/images/placeholder.jpg'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      isImage(file: File) {
        const reg = /(\.jpg|\.jpeg|\.webp|\.png)$/i
        return !!reg.exec(file.name)
      },
      humanFileSize: (bytes: number, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024

        if (Math.abs(bytes) < thresh) {
          return bytes + ' B'
        }

        const units = si
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let u = -1
        const r = 10 ** dp

        do {
          bytes /= thresh
          ++u
        } while (
          Math.round(Math.abs(bytes) * r) / r >= thresh &&
          u < units.length - 1
        )

        return bytes.toFixed(dp) + ' ' + units[u]
      },
      truncateMiddle: (text: string) => {
        const maxLength = 20
        const ext = text
          .substring(text.lastIndexOf('.') + 1, text.length)
          .toLowerCase()
        let newName = text.replace('.' + ext, '')
        if (text.length <= maxLength) {
          // if file string length is less than 8 do not format
          // return same string
          return text
        }
        newName =
          newName.substring(0, maxLength) +
          (text.length > maxLength ? '...' : '')
        return newName + '.' + ext
      },
      formatCurrency: (value: any) => {
        const c = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        })
        return c.format(value)
      },
      storageFile: (src: string) => {
        return src
          ? 'https://jyniblykiuownpbvzmlz.supabase.co/storage/v1/object/public/' +
              src
          : placeholder
      },
      getPagination(page: number, size: number) {
        const limit = size ? +size : 3
        const from = page ? page * limit : 0
        const to = page ? from + size - 1 : size - 1

        return { from, to }
      },
      pathToFilename: (path: string) => {
        return path.substring(path.lastIndexOf('/') + 1, path.length).slice(14)
      },
      getFileSizeFromUrl: (url: string) => {
        let size: any = null
        const http = new XMLHttpRequest()
        http.open('HEAD', url, false)
        http.send(null)
        if (http.status === 200) size = http.getResponseHeader('content-length')
        return size
      },
      pagination(length: number, currentPage: number, itemsPerPage: number) {
        return {
          total: length,
          per_page: itemsPerPage,
          current_page: currentPage,
          last_page: Math.ceil(length / itemsPerPage),
          from: (currentPage - 1) * itemsPerPage + 1,
          to: currentPage * itemsPerPage,
        }
      },
    },
  }
})
