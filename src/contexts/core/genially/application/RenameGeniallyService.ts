import GeniallyRepository from "../domain/GeniallyRepository";
import GeniallyNotExist from "../domain/errors/GeniallyNotExist";

// Define the request structure for renaming a Genially
type RenameGeniallyServiceRequest = {
  id: string;
  newName: string;
};

export default class RenameGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  // Executes the renaming of an existing Genially
  public async execute(req: RenameGeniallyServiceRequest): Promise<void> {
    const { id, newName } = req;

    // Check if the Genially exists in the repository
    const genially = await this.repository.find(id);
    if (!genially) {
      throw new GeniallyNotExist(id);
    }

    // Update the Genially's name
    genially.rename(newName);

    // Persist the updated Genially
    await this.repository.save(genially);
  }
}
