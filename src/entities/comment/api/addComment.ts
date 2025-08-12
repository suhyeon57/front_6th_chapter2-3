import { NewComment } from '@/entities/comment/model/types'

export const addCommentApi = async (newComment: NewComment) => {
  try {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 추가 오류:', error)
  }
}
