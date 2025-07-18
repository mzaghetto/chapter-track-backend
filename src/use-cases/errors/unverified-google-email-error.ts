export class UnverifiedGoogleEmailError extends Error {
  constructor() {
    super('Google account email is not verified.')
  }
}
