import Genially from "./Genially";

interface GeniallyRepository {

  // Saves a Genially to the repository (creates or updates an entry)
  save(genially: Genially): Promise<void>;

  // Finds a Genially by its ID, returns null if not found
  find(id: string): Promise<Genially | null>;

  // Marks a Genially as deleted (soft delete)
  delete(id: string): Promise<void>;

  // Retrieves all Geniallys that are not delete
  findAll(): Promise<Genially[]>;

  // Gets the total count of created Geniallys
  getCount(): Promise<number>;

  // Increments the counter for created Geniallys
  incrementCount(): Promise<void>;
}

export default GeniallyRepository;
