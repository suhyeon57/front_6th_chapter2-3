export const searchPostsApi = async (searchQuery: string) => {
  try {
    const response = await fetch(`/api/posts/search?q=${searchQuery}`)
    return await response.json()
  } catch (error) {
    console.error('게시물 검색 오류:', error)
  }
}
