export class InvalidGoogleTokenError extends Error {
  constructor() {
    super('Invalid Google token.')
  }
}
