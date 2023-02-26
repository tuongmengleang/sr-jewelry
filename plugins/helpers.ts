import moment from 'moment'
// @ts-ignore
import placeholder from '~/assets/images/placeholder.jpg'
// @ts-ignore
import profilePlaceholder from '~/assets/images/profile-placeholder.png'

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
      humanPrice: (amount: number) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        })
        return formatter.format(amount)
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
      profileUrl: (src: string) => {
        return src
          ? `https://jyniblykiuownpbvzmlz.supabase.co/storage/v1/object/public/${src}`
          : profilePlaceholder
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
      getGenerateID() {
        return `#SR-${Date.now()}`
      },
      getDateRangeByKeyword(keyword: string) {
        let dateRange: string[] = []
        switch (keyword) {
          case 'this-week':
            dateRange = [
              moment()
                .subtract(1, 'weeks')
                .startOf('week')
                .format('YYYY/MM/DD'),
              moment(Date.now()).format('YYYY/MM/DD'),
            ]
            break
          case 'last-week':
            dateRange = [
              moment()
                .subtract(2, 'weeks')
                .startOf('week')
                .format('YYYY/MM/DD'),
              moment().subtract(2, 'weeks').endOf('week').format('YYYY/MM/DD'),
            ]
            break
          case 'this-month':
            dateRange = [
              moment().startOf('month').format('YYYY/MM/DD'),
              moment().endOf('month').format('YYYY/MM/DD'),
            ]
            break
          case 'this-year':
            dateRange = [
              moment().startOf('year').format('YYYY/MM/DD'),
              moment().endOf('year').format('YYYY/MM/DD'),
            ]
            break
          case 'last-year':
            dateRange = [
              moment().subtract(1, 'year').startOf('year').format('YYYY/MM/DD'),
              moment().subtract(1, 'year').endOf('year').format('YYYY/MM/DD'),
            ]
            break
          default:
            dateRange = ['', '']
            break
        }
        return dateRange
      },
    },
  }
})
