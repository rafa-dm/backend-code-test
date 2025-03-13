import GeniallyNotExist from "../domain/errors/GeniallyNotExist";
import GeniallyRepository from "../domain/GeniallyRepository";

// Define the request structure for deleting a Genially
type DeleteGeniallyServiceRequest = {
  id: string;
};

export default class DeleteGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  // Executes the deletion of a Genially (soft delete)
  public async execute(req: DeleteGeniallyServiceRequest): Promise<void> {
    const { id } = req;

    // Check if the Genially exists in the repository
    const existingGenially = await this.repository.find(id);
    if (!existingGenially) {
      throw new GeniallyNotExist(id);
    }

    // Perform a soft delete by setting the "deletedAt" field
    await this.repository.delete(id);
  }
}
