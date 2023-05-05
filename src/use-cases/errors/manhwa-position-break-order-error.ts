export class ManhwaPositionBreakOrderError extends Error {
  constructor(manhwa_id: string, position: number, manhwa_position: number) {
    super(
      `Manhwa position ${manhwa_id} break the order. The position should be ${position}, but get ${manhwa_position}`,
    )
  }
}
