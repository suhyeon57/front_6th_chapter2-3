export const fetchCommentApi = async (postId: Number) => {
  try {
    const response = await fetch(`/api/comments/post/${postId}`)
    return await response.json()
  } catch (error) {
    console.error('댓글 가져오기 오류:', error)
  }
}
