import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Post, Reply } from '@/types/group.type.ts'
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

  private replyKeyMapping: KeyMapping = {
    id: 'id',
    message: 'message',
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

  async getPostById(id: number): Promise<{ post: Post; reply: PageResponse<Reply> }> {
    const res = await this.setAuth().get(`/detail/${id}`)
    const { post, comments } = this.unpackRes(res) as { post: any; comments: PageResponse<Reply> }
    const postDetail = cleanObj<Post>(post, this.postKeyMapping)
    postDetail.author = {
      ref: post.authorRef,
      nickname: post.authorNickname,
      profileImg: post.authorProfileImg,
    }
    const replyList = comments.list.map((reply: any) => {
      const semi = cleanObj<Reply>(reply, this.replyKeyMapping)
      semi.author = {
        ref: reply.authorRef,
        nickname: reply.authorNickname,
        profileImg: reply.authorProfileImg,
      }
      return semi
    })
    return {
      post: postDetail,
      reply: {
        meta: comments.meta,
        list: replyList,
      },
    }
  }

  async getPostReply(id: number, options?: { page?: PageRequest }) {
    const res = await this.setAuth().get(`/${id}/reply`, {
      params: {
        page: options?.page?.page,
        size: options?.page?.size || 20,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Reply>
    if (list.length > 0) {
      return {
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
        list: list.map((reply: any) => {
          const semi = cleanObj<Reply>(reply, this.replyKeyMapping)
          semi.author = {
            ref: reply.authorRef,
            nickname: reply.authorNickname,
            profileImg: reply.authorProfileImg,
          }
          return semi
        }),
      }
    }
    return this.emptyPage as PageResponse<Reply>
  }

  async uploadImage(
    type: string,
    file: File,
    options?: {
      nickname?: string
    },
  ): Promise<{ location: string }> {
    let path = ''
    if (type === 'post') {
      const salt = genRandStr(7)
      path = `/upload/post/${salt}`
    } else if (type === 'user-profile') {
      path = `/upload/user/profile/${options?.nickname}`
    }
    if (path) {
      const formData = new FormData()
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

  async createComment(postId: number, params: { message: string }): Promise<void> {
    await this.setAuth().post(`/${postId}/reply/new`, params)
  }

  // async getPostByRef()
  //
  async deletePost(postId: number): Promise<void> {
    await this.setAuth().delete(`/${postId}/delete`)
  }

  async deleteReply(postId: number, replyId: number): Promise<void> {
    await this.setAuth().delete(`/${postId}/reply/${replyId}/delete`)
  }
}
