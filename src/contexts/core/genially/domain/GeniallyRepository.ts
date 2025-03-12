import Genially from "./Genially";

interface GeniallyRepository {
  save(genially: Genially): Promise<void>;

  find(id: string): Promise<Genially | null>;

  delete(id: string): Promise<void>;

  findAll(): Promise<Genially[]>;

  getCount(): Promise<number>;

  incrementCount(): Promise<void>;
}

export default GeniallyRepository;
