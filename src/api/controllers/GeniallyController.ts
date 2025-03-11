import { Request, Response } from "express";
import CreateGeniallyService from "../../contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../../contexts/core/genially/application/DeleteGeniallyService";
import GeniallyNotExist from "../../contexts/core/genially/domain/errors/GeniallyNotExist";

export default class GeniallyController {
  constructor(
    private createGeniallyService: CreateGeniallyService,
    private deleteGeniallyService: DeleteGeniallyService
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const genially = await this.createGeniallyService.execute(req.body);
      return res.status(201).json(genially);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteGeniallyService.execute({ id });
      return res.status(204).send();
    } catch (error) {
      if (error instanceof GeniallyNotExist) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
