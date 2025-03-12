import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

export default class InMemoryGeniallyRepository implements GeniallyRepository {
  private geniallys: Genially[] = [];
  private counter = 0;

  async save(genially: Genially): Promise<void> {
    const index = this.geniallys.findIndex((g) => g.id === genially.id);
    if (index !== -1) {
      this.geniallys[index] = genially;
    } else {
      this.geniallys.push(genially);
    }
  }

  async find(id: string): Promise<Genially | null> {
    return this.geniallys.find((genially) => genially.id === id) || null;
  }

  async delete(id: string): Promise<void> {
    const index = this.geniallys.findIndex((genially) => genially.id === id);
    if (index !== -1) {
      this.geniallys[index].delete();
    }
  }

  async findAll(): Promise<Genially[]> {
    return this.geniallys;
  }

  async getCount(): Promise<number> {
    return this.counter;
  }

  async incrementCount(): Promise<void> {
    this.counter++;
  }
}
