export interface DetailedManhwaProvider {
  id: bigint
  manhwaId: bigint
  manhwaName: string
  providerId: bigint
  providerName: string
  lastEpisodeReleased: number | null
  url: string | null
  createdAt: Date
  updatedAt: Date
}
