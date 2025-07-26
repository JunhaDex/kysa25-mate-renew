import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Post } from '@/types/group.type.ts'
import { cleanObj } from '@/utils/use.util.ts'

export class PostService extends ApiService {
  private postKeyMapping: KeyMapping = {
    id: 'id',
    image: 'image',
    message: 'content',
    likes: 'likes',
    comments: 'comments',
    createdAt: 'createdAt',
  }

  constructor() {
    super('post')
  }

  async getGroupPosts(ref: string, options?: { page?: PageRequest }) {
    const res = await this.setAuth().get(`/feed/${ref}`, {
      params: {
        page: options?.page?.page,
        size: options?.page?.size || 10,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Post>
    if (list.length > 0) {
      return {
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
        list: list.map((post: any) => {
          const semi = cleanObj<Post>(post, this.postKeyMapping)
          semi.author = {
            ref: post.authorRef,
            nickname: post.authorNickname,
            profileImg: post.authorProfileImg,
          }
          return semi
        }),
      }
    }
    return this.emptyPage as PageResponse<Post>
  }

  // async getPostByRef()
  //
  // async likePost()
  //
  // async createPost()
  //
  // async deletePost()
  //
  // async createComment()
  //
  // async deleteComment()
}
