import GeniallyRepository from "../domain/GeniallyRepository";
import GeniallyNotExist from "../domain/errors/GeniallyNotExist";

type RenameGeniallyServiceRequest = {
  id: string;
  newName: string;
};

export default class RenameGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  public async execute(req: RenameGeniallyServiceRequest): Promise<void> {
    const { id, newName } = req;

    const genially = await this.repository.find(id);
    if (!genially) {
      throw new GeniallyNotExist(id);
    }

    genially.rename(newName);

    await this.repository.save(genially);
  }
}
