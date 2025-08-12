import { NewComment } from '@/entities/comment/model/types'

//API만 호출하는 순수함수 --> 매개변수가 외부에서 호출을 할 수 없으므로 지정 필요
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
