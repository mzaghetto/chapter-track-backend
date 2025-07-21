import { UserNotifications } from '@prisma/client'

export type DetailedUserNotification = UserNotifications & {
  user: {
    telegramId: string | null
    name: string
    telegramActive: boolean
  }
  manhwa: {
    name: string
  }
}
