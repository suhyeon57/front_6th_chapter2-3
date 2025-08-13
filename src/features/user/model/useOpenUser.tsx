import { openUsersApi } from '@/entities/user/api/openUsers'
import { User } from '@/entities/user/model/types'

export const useOpenUser = (
  setSelectedUser: (user: User | null) => void,
  setShowUserModal: (show: boolean) => void
) => {
  return async (user: User) => {
    try {
      const userData = await openUsersApi(user)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error('사용자 정보 열기 오류:', error)
    }
  }
}
