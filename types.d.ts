import { Dispatch as DispatchAction, SetStateAction } from "react"

export interface PostObject {
  title: string
  date: string
  link: string
  author: string
  id: string
  isLiked: boolean
}

export type Obj<T = unknown> = Record<string, T>

export type AlgoliaHit = {
  author: string
  comment_text: string
  created_at: string
  created_at_i: number
  num_comments: string | null
  objectID: string
  parent_id: number
  points: number | null
  story_id: number
  story_text: string | null
  story_title: string | null
  story_url: string | null
  title: null
  url: string | null
  _tags?: string[]
}

export type Dispatch<T> = DispatchAction<SetStateAction<T>>
