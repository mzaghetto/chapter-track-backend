export class RoleUpdateError extends Error {
  constructor() {
    super('The role cannot be changed.')
  }
}
