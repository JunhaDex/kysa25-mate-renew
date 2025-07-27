import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Post } from '@/types/group.type.ts'
import { cleanObj, genRandStr } from '@/utils/use.util.ts'

export class PostService extends ApiService {
  private postKeyMapping: KeyMapping = {
    id: 'id',
    image: 'image',
    message: 'content',
    likes: 'likes',
    comments: 'comments',
    createdAt: 'createdAt',
    already: 'isLiked',
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

  async uploadImage(type: string, file: File): Promise<{ location: string }> {
    let path = ''
    if (type === 'post') {
      const salt = genRandStr(7)
      path = `/upload/post/${salt}`
    }
    if (path) {
      const formData = new FormData()
      console.log(file)
      formData.append('file', file)
      const res = await this.setAuth().post(`${import.meta.env.VITE_API_URL}${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return this.unpackRes(res) as { location: string }
    }
    throw new Error('Invalid type for image upload')
  }

  async createPost(params: { groupRef: string; message: string; image?: string }): Promise<void> {
    await this.setAuth().post('/new', params)
  }

  async likePost(postId: number, state: boolean): Promise<void> {
    await this.setAuth().put(
      `/like/${postId}`,
      {},
      {
        params: {
          undo: state ? 'false' : 'true',
        },
      },
    )
  }

  // async getPostByRef()
  //
  // async deletePost()
  //
  // async createComment()
  //
  // async deleteComment()
}
