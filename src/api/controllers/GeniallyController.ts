import { Request, Response } from "express";
import CreateGeniallyService from "../../contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../../contexts/core/genially/application/DeleteGeniallyService";
import GeniallyNotExist from "../../contexts/core/genially/domain/errors/GeniallyNotExist";
import InvalidGeniallyName from "../../contexts/core/genially/domain/errors/InvalidGeniallyName";
import RenameGeniallyService from "../../contexts/core/genially/application/RenameGeniallyService";
import SameGeniallyName from "../../contexts/core/genially/domain/errors/SameGeniallyName";
import GeniallyIsDeleted from "../../contexts/core/genially/domain/errors/GeniallyIsDeleted";
import GeniallyRepository from "../../contexts/core/genially/domain/GeniallyRepository";

export default class GeniallyController {
  constructor(
    private createGeniallyService: CreateGeniallyService,
    private deleteGeniallyService: DeleteGeniallyService,
    private renameGeniallyService: RenameGeniallyService,
    private repository: GeniallyRepository
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const genially = await this.createGeniallyService.execute(req.body);
      return res.status(201).json({
        id: genially.id,
        name: genially.name,
        description: genially.description,
        createdAt: genially.createdAt,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteGeniallyService.execute({ id });
      return res
        .status(200)
        .json({ message: `Genially ${id} deleted successfully.` });
    } catch (error) {
      if (error instanceof GeniallyNotExist) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async rename(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { newName } = req.body;

      await this.renameGeniallyService.execute({ id, newName });
      return res.status(200).json({
        message: `Genially ${id} renamed successfully to "${newName}".`,
      });
    } catch (error) {
      if (
        error instanceof GeniallyNotExist ||
        error instanceof InvalidGeniallyName ||
        error instanceof GeniallyIsDeleted ||
        error instanceof SameGeniallyName
      ) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const genially = await this.repository.find(id);
      if (!genially) {
        return res
          .status(404)
          .json({ error: `Genially with ID ${id} not found.` });
      }
      return res.status(200).json(genially);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const geniallys = await this.repository.findAll();
      return geniallys.length === 0
        ? res.status(200).json({ message: "Repository is empty" })
        : res.status(200).json(geniallys);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
