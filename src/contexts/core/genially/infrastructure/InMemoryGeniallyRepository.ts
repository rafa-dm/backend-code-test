import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

export default class InMemoryGeniallyRepository implements GeniallyRepository {

  // In-memory storage for Geniallys
  private geniallys: Genially[] = [];

  // Counter to track the number of created Geniallys
  private counter = 0;

  // Saves a Genially in memory (creates or updates it)
  async save(genially: Genially): Promise<void> {
    const index = this.geniallys.findIndex((g) => g.id === genially.id);
    if (index !== -1) {
      this.geniallys[index] = genially;
    } else {
      this.geniallys.push(genially);
    }
  }

  // Finds a Genially by its ID, returns null if not found
  async find(id: string): Promise<Genially | null> {
    return this.geniallys.find((genially) => genially.id === id) || null;
  }

  // Marks a Genially as deleted (soft delete)
  async delete(id: string): Promise<void> {
    const index = this.geniallys.findIndex((genially) => genially.id === id);
    if (index !== -1) {
      this.geniallys[index].delete();
    }
  }

  // Retrieves all stored Geniallys (including deleted ones)
  async findAll(): Promise<Genially[]> {
    return this.geniallys;
  }

  // Gets the total count of Geniallys created
  async getCount(): Promise<number> {
    return this.counter;
  }

  // Increments the counter for created Geniallys
  async incrementCount(): Promise<void> {
    this.counter++;
  }
}
