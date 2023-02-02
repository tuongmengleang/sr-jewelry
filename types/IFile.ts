export interface IFile {
  id?: string | any
  file: File | Blob | null
  src: string
  name?: string | any
  size?: string
  originalName: string | any
  extension?: RegExpExecArray | undefined | null
}
