export default class InvalidGeniallyDescription extends Error {
  constructor() {
    super("Description must be 125 characters or less.");
  }
}
