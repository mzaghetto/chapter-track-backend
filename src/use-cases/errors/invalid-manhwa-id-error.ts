export class InvalidManhwaIdError extends Error {
  constructor(manhwa_id: string) {
    super(`Invalid manhwa_id: ${manhwa_id}`)
  }
}
