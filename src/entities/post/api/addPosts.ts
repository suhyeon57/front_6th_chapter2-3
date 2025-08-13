export const addPostsApi = async (newPost: any) => {
  try {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
    return await response.json()
  } catch (error) {
    console.error('게시물 추가 오류:', error)
  }
}
