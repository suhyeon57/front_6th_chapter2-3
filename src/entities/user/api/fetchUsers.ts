export const fetchUsersApi = async () => {
  try {
    const response = await fetch('/api/users?limit=0&select=username,image')
    return response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
