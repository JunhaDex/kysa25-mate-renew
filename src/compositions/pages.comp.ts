import type { PageMeta, PageResponse } from '@/types/common.type.ts'
import { computed, ref } from 'vue'

export function usePagination() {
  const pageInfo = ref<PageMeta>({
    pageNo: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
  })
  const onLoad = ref(false)
  const onInit = ref(false)
  const hasMore = computed<boolean>(() => {
    if (pageInfo.value.totalPage === 0) {
      return true
    } else {
      return pageInfo.value.pageNo < pageInfo.value.totalPage
    }
  })

  async function fetchListData<T>(loader: Promise<PageResponse<T>>): Promise<T[]> {
    if (hasMore.value) {
      onLoad.value = true
      const res = await loader
      pageInfo.value = res.meta
      onLoad.value = false
      return res.list
    }
    return []
  }

  async function initialized() {
    onInit.value = true
  }

  return { pageInfo, onLoad, onInit, hasMore, fetchListData, initialized }
}
