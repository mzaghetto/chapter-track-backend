export class InvalidManhwaIdError extends Error {
  constructor(manhwa_id: bigint) {
    super(`Invalid manhwa_id: ${manhwa_id}`)
  }
}
