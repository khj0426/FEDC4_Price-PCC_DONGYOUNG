import { useQuery } from '@tanstack/react-query'
import { getPostDetail } from '@/services/post'
import type Comment from '@/types/comment'

const useGetComment = (postId: string, initComments?: Comment[]) => {
  return useQuery({
    queryKey: ['getAllComments', postId, initComments],
    queryFn: async () => {
      const data = await getPostDetail(postId)
      return data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: [initComments],
  })
}

export default useGetComment
