export const updatePostsApi = async (selectedPost: any) => {
  try {
    const response = await fetch(`/api/posts/${selectedPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPost),
    })
    return await response.json()
  } catch (error) {
    console.error('게시물 업데이트 오류:', error)
  }
}
