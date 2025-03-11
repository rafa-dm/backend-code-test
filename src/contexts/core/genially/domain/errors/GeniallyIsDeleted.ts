export default class GeniallyIsDeleted extends Error {
  constructor(id: string) {
    super(`Genially with ID ${id} is deleted and cannot be modified.`);
  }
}
