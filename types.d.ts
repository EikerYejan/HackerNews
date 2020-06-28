export interface PostObject {
  title: string
  date: string
  link: string
  author
}

export type Obj<T = unknown> = Record<string, T>
