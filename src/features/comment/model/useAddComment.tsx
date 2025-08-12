import { useCallback } from 'react'
import { addCommentApi } from '@/entities/comment/api/addComment'
import { NewComment, CommentsByPost } from '@/entities/comment/model/types'

export const useAddComment = (
  newComment: NewComment,
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>,
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>,
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useCallback(async () => {
    try {
      const data = await addCommentApi(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: '', postId: null, userId: 1 })
    } catch (error) {
      console.error('댓글 추가 오류:', error)
    }
  }, [newComment, setComments, setShowAddCommentDialog, setNewComment])
}
