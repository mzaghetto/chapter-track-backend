export class ManhwaAlreadyExistsError extends Error {
  constructor() {
    super('Manhwa already exists.')
  }
}
