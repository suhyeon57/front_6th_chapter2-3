import { updateCommentApi } from '@/entities/comment/api/updateComment'
import { CommentsByPost } from '@/entities/comment/model/types'
import { selectedCommentType } from '@/entities/comment/model/types'

export const useUpdateComment = (
  selectedComment: selectedCommentType,
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>,
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async () => {
    try {
      const data = await updateCommentApi(selectedComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) =>
          comment.id === data.id ? data : comment
        ),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error('댓글 업데이트 오류:', error)
    }
  }
}
