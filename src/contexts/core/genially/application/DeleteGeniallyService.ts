import GeniallyNotExist from "../domain/errors/GeniallyNotExist";
import GeniallyRepository from "../domain/GeniallyRepository";

type DeleteGeniallyServiceRequest = {
  id: string;
};

export default class DeleteGeniallyService {
  constructor(private repository: GeniallyRepository) {}

  public async execute(req: DeleteGeniallyServiceRequest): Promise<void> {
    const { id } = req;

    const existingGenially = await this.repository.find(id);
    if (!existingGenially) {
      throw new GeniallyNotExist(id);
    }

    await this.repository.delete(id);
  }
}
