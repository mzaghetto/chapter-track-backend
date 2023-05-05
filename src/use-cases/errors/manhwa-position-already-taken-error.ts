export class ManhwaPositionAlreadyTakenError extends Error {
  constructor(manhwa_id: string) {
    super(`Manhwa position ${manhwa_id} already taken by another manhwa`)
  }
}
