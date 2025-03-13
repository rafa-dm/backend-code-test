import GeniallyAlreadyExists from "../domain/errors/GeniallyAlreadyExists";
import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

// Define the request structure for creating a Genially
type CreateGeniallyServiceRequest = {
  id: string;
  name: string;
  description: string;
};

export default class CreateGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  // Executes the creation of a new Genially
  public async execute(req: CreateGeniallyServiceRequest): Promise<Genially> {
    const { id, name, description } = req;

    // Check if the Genially ID already exists
    const existingGenially = await this.repository.find(id);
    if (existingGenially) {
      throw new GeniallyAlreadyExists(id);
    }

    // Create a new Genially instance
    const genially = new Genially(id, name, description);

    // Persist the new Genially in the repository
    await this.repository.save(genially);

    // Increment the total count of created Geniallys
    await this.repository.incrementCount();

    return genially;
  }
}
