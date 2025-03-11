import GeniallyAlreadyExists from "../domain/errors/GeniallyAlreadyExists";
import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

type CreateGeniallyServiceRequest = {
  id: string;
  name: string;
  description: string;
};

export default class CreateGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  public async execute(req: CreateGeniallyServiceRequest): Promise<Genially> {
    const { id, name, description } = req;

    const existingGenially = await this.repository.find(id);
    if (existingGenially) {
      throw new GeniallyAlreadyExists(id);
    }

    const genially = new Genially(id, name, description);
    await this.repository.save(genially);

    return genially;
  }
}
