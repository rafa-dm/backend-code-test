export default class GeniallyAlreadyExists extends Error {
  constructor(id: string) {
    super(`Genially with ID ${id} already exists.`);
  }
}
