import type {Mention} from "@/types/common.type.ts";

export interface Group {
  id: number
  ref: string
  groupName: string
  creator: Mention
  profileImg: string
  coverImg: string
  introduce: string
  isShow: boolean
  priority: number
  posts: Post[]
  followers: number
  already?: boolean
}

export interface Post {}
