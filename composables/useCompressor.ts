import Compressor from 'compressorjs'

export const useCompressor = (file: File) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality: 0.6,
      success(file: File | Blob) {
        resolve(file)
      },
      error(error: Error) {
        reject(error)
      },
    })
  })
}
