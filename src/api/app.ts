import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";

// Controllers (route handlers)
import * as healthController from "./controllers/health";

import GeniallyController from "./controllers/GeniallyController";
import CreateGeniallyService from "../contexts/core/genially/application/CreateGeniallyService";
import InMemoryGeniallyRepository from "../contexts/core/genially/infrastructure/InMemoryGeniallyRepository";

// Create Express server
const app = express();

const repository = new InMemoryGeniallyRepository();
const createGeniallyService = new CreateGeniallyService(repository);
const geniallyController = new GeniallyController(createGeniallyService);

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

export default app;
