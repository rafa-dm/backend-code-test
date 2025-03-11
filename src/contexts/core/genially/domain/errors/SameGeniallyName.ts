export default class SameGeniallyName extends Error {
  constructor() {
    super("New name must be different from the current name.");
  }
}
