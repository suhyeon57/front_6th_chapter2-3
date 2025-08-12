import { selectedCommentType } from '../model/types'

export const updateCommentApi = async (
  selectedComment: selectedCommentType
) => {
  try {
    const response = await fetch(`/api/comments/${selectedComment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: selectedComment.body }),
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 업데이트 오류:', error)
  }
}
