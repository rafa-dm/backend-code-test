import Genially from "./Genially";

interface GeniallyRepository {
  save(genially: Genially): Promise<void>;

  find(id: string): Promise<Genially>;

  delete(id: string): Promise<void>;

  findAll(): Promise<Genially[]>;
}

export default GeniallyRepository;
