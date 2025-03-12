import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";
import dotenv from "dotenv";

// Controllers (route handlers)
import * as healthController from "./controllers/health";

import GeniallyController from "./controllers/GeniallyController";
import CreateGeniallyService from "../contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../contexts/core/genially/application/DeleteGeniallyService";
import RenameGeniallyService from "../contexts/core/genially/application/RenameGeniallyService";

import InMemoryGeniallyRepository from "../contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import MongoGeniallyRepository from "../contexts/core/genially/infrastructure/MongoGeniallyRepository";
import mongoose from "mongoose";

dotenv.config();

// Create Express server
const app = express();
const useMongoDB = process.env.USE_MONGO_DB === "true";

let repository;

if (useMongoDB) {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/genially")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((error) => {
      console.error("❌ Error connecting to MongoDB:", error);
      process.exit(1);
    });

  repository = new MongoGeniallyRepository();
} else {
  repository = new InMemoryGeniallyRepository();
}

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
app.patch("/genially/:id", (req, res) => geniallyController.rename(req, res));
app.get("/genially/details/:id", (req, res) =>
  geniallyController.findById(req, res)
);
app.get("/geniallys", (req, res) => geniallyController.findAll(req, res));
app.get("/genially/count", (req, res) => geniallyController.count(req, res));

export default app;
