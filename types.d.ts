export interface PostObject {
  title: string
  date: string
  link: string
  author: string
  id: string
  isLiked: boolean
}

export type Obj<T = unknown> = Record<string, T>
