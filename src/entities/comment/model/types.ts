export interface Comment {
  id: string // 반드시 있어야 함
  body: string
  likes: number
  user: {
    username: string
  }
}

export type CommentsByPost = {
  [postId: string]: Comment[]
}

export interface NewComment {
  body: string
  postId: string | null
  userId: number
}

export interface selectedCommentType {
  id: string | number
  body: string
  postId: string | number | null
  userId: number | null
}
