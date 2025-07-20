export class ManhwaPositionAlreadyTakenError extends Error {
  constructor(order: number) {
    super(`Manhwa position ${order} already taken by another manhwa`)
  }
}
