import { searchPostsApi } from '@/entities/post/api/searchPosts'

export const useSearchPosts = (
  searchQuery: string,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  setTotal: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchPosts: () => void
) => {
  return async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await searchPostsApi(searchQuery)
      setPosts(data.posts)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }
}
