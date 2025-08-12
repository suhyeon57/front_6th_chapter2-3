export const deleteCommentApi = async (id: string) => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 삭제 오류:', error)
  }
}
