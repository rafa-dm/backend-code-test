import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import GeniallyController from "../../../src/api/controllers/GeniallyController";
import CreateGeniallyService from "../../../src/contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../../../src/contexts/core/genially/application/DeleteGeniallyService";
import RenameGeniallyService from "../../../src/contexts/core/genially/application/RenameGeniallyService";
import InMemoryGeniallyRepository from "../../../src/contexts/core/genially/infrastructure/InMemoryGeniallyRepository";

describe("GeniallyController", () => {
  let app: express.Express;
  let repository: InMemoryGeniallyRepository;
  let controller: GeniallyController;

  beforeEach(() => {
    repository = new InMemoryGeniallyRepository();
    const createGeniallyService = new CreateGeniallyService(repository);
    const deleteGeniallyService = new DeleteGeniallyService(repository);
    const renameGeniallyService = new RenameGeniallyService(repository);
    controller = new GeniallyController(
      createGeniallyService,
      deleteGeniallyService,
      renameGeniallyService,
      repository
    );

    app = express();
    app.use(bodyParser.json());
    app.post("/genially", (req, res) => controller.create(req, res));
    app.delete("/genially/:id", (req, res) => controller.delete(req, res));
    app.patch("/genially/:id", (req, res) => controller.rename(req, res));
    app.get("/genially/details/:id", (req, res) =>
      controller.findById(req, res)
    );
    app.get("/geniallys", (req, res) => controller.findAll(req, res));
    app.get("/genially/count", (req, res) => controller.count(req, res));
  });

  describe("POST /genially - Create Genially", () => {
    it("should create a new Genially", async () => {
      const response = await request(app)
        .post("/genially")
        .send({ id: "1", name: "Test Genially", description: "Description" });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe("1");
    });

    it("should return an error if name is too short", async () => {
      const response = await request(app)
        .post("/genially")
        .send({ id: "2", name: "Te", description: "Description" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("DELETE /genially/:id - Delete Genially", () => {
    it("should delete an existing Genially", async () => {
      await request(app)
        .post("/genially")
        .send({ id: "3", name: "To be deleted", description: "Description" });

      const response = await request(app).delete("/genially/3");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Genially 3 deleted successfully.");
    });

    it("should return an error if trying to delete a non-existing Genially", async () => {
      const response = await request(app).delete("/genially/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("PATCH /genially/:id - Rename Genially", () => {
    it("should rename an existing Genially", async () => {
      await request(app)
        .post("/genially")
        .send({ id: "4", name: "Old Name", description: "Description" });

      const response = await request(app)
        .patch("/genially/4")
        .send({ newName: "New Name" });

      expect(response.status).toBe(200);
    });

    it("should return an error if Genially does not exist", async () => {
      const response = await request(app)
        .patch("/genially/999")
        .send({ newName: "Nonexistent" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /geniallys - Find All Geniallys", () => {
    it("should return an empty message when repository is empty", async () => {
      const response = await request(app).get("/geniallys");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Repository is empty" });
    });

    it("should return a list of Geniallys when repository is populated", async () => {
      await request(app).post("/genially").send({
        id: "1",
        name: "Genially 1",
        description: "Description 1",
      });

      await request(app).post("/genially").send({
        id: "2",
        name: "Genially 2",
        description: "Description 2",
      });

      const response = await request(app).get("/geniallys");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("_id", "1");
      expect(response.body[1]).toHaveProperty("_id", "2");
    });
  });

  describe("GET /genially/details/:id - Find Genially by ID", () => {
    it("should return a Genially by ID", async () => {
      await request(app).post("/genially").send({
        id: "1",
        name: "Genially Test",
        description: "Description",
      });

      const response = await request(app).get("/genially/details/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", "1");
      expect(response.body).toHaveProperty("_name", "Genially Test");
      expect(response.body).toHaveProperty("_description", "Description");
      expect(response.body).toHaveProperty("_createdAt");
    });

    it("should return 404 if Genially does not exist", async () => {
      const response = await request(app).get("/genially/details/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Genially with ID 999 not found.",
      });
    });
  });

  describe("GET /genially/count - Consult counter", () => {
    it("should return the correct Genially count", async () => {
      await request(app)
        .post("/genially")
        .send({ id: "1", name: "Genially 1", description: "Description 1" });
      await request(app)
        .post("/genially")
        .send({ id: "2", name: "Genially 2", description: "Description 2" });

      const response = await request(app).get("/genially/count");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("count", 2);
    });
  });
});
