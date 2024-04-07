export class TelegramIDRequired extends Error {
  constructor() {
    super("Telegram ID is required when the user hasn't registered one.")
  }
}
