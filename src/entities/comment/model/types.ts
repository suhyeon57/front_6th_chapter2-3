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
