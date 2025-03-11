import { Request, Response } from "express";
import CreateGeniallyService from "../../contexts/core/genially/application/CreateGeniallyService";

export default class GeniallyController {
  constructor(private createGeniallyService: CreateGeniallyService) {}

  async create(req: Request, res: Response): Promise<Response> {
    console.log("Request: " + JSON.stringify(req.body));
    try {
      const genially = await this.createGeniallyService.execute(req.body);
      return res.status(201).json(genially);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
