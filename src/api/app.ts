import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";

// Controllers (route handlers)
import * as healthController from "./controllers/health";

import GeniallyController from "./controllers/GeniallyController";
import CreateGeniallyService from "../contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../contexts/core/genially/application/DeleteGeniallyService";
import InMemoryGeniallyRepository from "../contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import RenameGeniallyService from "../contexts/core/genially/application/RenameGeniallyService";

// Create Express server
const app = express();

const repository = new InMemoryGeniallyRepository();
const createGeniallyService = new CreateGeniallyService(repository);
const deleteGeniallyService = new DeleteGeniallyService(repository);
const renameGeniallyService = new RenameGeniallyService(repository);
const geniallyController = new GeniallyController(
  createGeniallyService,
  deleteGeniallyService,
  renameGeniallyService,
  repository
);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Primary app routes
app.get("/", healthController.check);

app.post("/genially", (req, res) => geniallyController.create(req, res));
app.delete("/genially/:id", (req, res) => geniallyController.delete(req, res));
app.put("/genially/:id", (req, res) => geniallyController.rename(req, res));
app.get("/genially/details/:id", (req, res) =>
  geniallyController.findById(req, res)
);
app.get("/genially/list", (req, res) => geniallyController.findAll(req, res));

export default app;
