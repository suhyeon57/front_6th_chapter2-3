export const likeCommentApi = async (id: string, likes: number) => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        likes: likes + 1,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 좋아요 오류:', error)
  }
}
