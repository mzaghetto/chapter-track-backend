import { ManhwaStatus, UserManhwaStatus } from '@prisma/client'

export interface DetailedUserManhwa {
  id: bigint
  manhwaId: bigint
  manhwaName: string
  coverImage: string | null
  providerId: bigint | null
  providerName: string | null
  lastEpisodeReleased: number | null
  manhwaUrlProvider: string | null
  statusReading: UserManhwaStatus
  statusManhwa: ManhwaStatus | null
  lastEpisodeRead: number | null
  lastNotifiedEpisode: number | null
  isTelegramNotificationEnabled: boolean
  order: number
  lastUpdated: Date | null
  createdAt: Date
  updatedAt: Date
}
