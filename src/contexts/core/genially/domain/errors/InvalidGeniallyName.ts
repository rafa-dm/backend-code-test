export default class InvalidGeniallyName extends Error {
  constructor() {
    super("Name must be between 3 and 20 characters.");
  }
}
