import { fetchPostsApi } from '@/entities/post/api/fetchPosts'
import { fetchUsersApi } from '@/entities/user/api/fetchUsers'
import { Post } from '@/entities/post/model/types'
import { User } from '@/entities/user/model/types'

export const useFetchPosts = (
  limit: number,
  skip: number,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  setTotal: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async () => {
    setLoading(true)
    try {
      const postsData = await fetchPostsApi(limit, skip)
      const usersData = await fetchUsersApi()
      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error('게시물 가져오기 오류:', error)
    }
    setLoading(false)
  }
}
