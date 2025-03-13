import mongoose, { Document, Schema } from "mongoose";
import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

// Defines the structure of a Genially document in MongoDB
interface GeniallyDocument extends Document {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  modifiedAt?: Date;
  deletedAt?: Date;
}

// Schema for storing Genially entities in MongoDB
const GeniallySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date },
  deletedAt: { type: Date },
});

// Creates a Mongoose model for Geniallys
const GeniallyModel = mongoose.model<GeniallyDocument>(
  "Genially",
  GeniallySchema
);

// Schema for tracking the count of created Geniallys
const GeniallyCounterSchema = new Schema({
  count: { type: Number, default: 0 },
});

// Creates a Mongoose model for the counter
const GeniallyCounterModel = mongoose.model(
  "GeniallyCounter",
  GeniallyCounterSchema
);

export default class MongoGeniallyRepository implements GeniallyRepository {
  // Saves a Genially in MongoDB (creates or updates it)
  async save(genially: Genially): Promise<void> {
    const geniallyData = {
      id: genially.id,
      name: genially.name,
      description: genially.description,
      createdAt: genially.createdAt || new Date(),
      modifiedAt: new Date(),
      deletedAt: genially.deletedAt || null,
    };

    await GeniallyModel.updateOne({ id: genially.id }, geniallyData, {
      upsert: true,
    });
  }

  // Marks a Genially as deleted by setting deletedAt
  async delete(id: string): Promise<void> {
    await GeniallyModel.findOneAndUpdate({ id }, { deletedAt: new Date() });
  }

  // Finds a Genially by ID, returns null if not found
  async find(id: string): Promise<Genially> {
    const geniallyDoc = await GeniallyModel.findOne({ id });
    return geniallyDoc ? this.toGenially(geniallyDoc) : null;
  }

  // Retrieves all stored Geniallys that are not deleted
  async findAll(): Promise<Genially[]> {
    const geniallys = await GeniallyModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });
    return geniallys.map(this.toGenially);
  }

  // Gets the total count of created Geniallys
  async getCount(): Promise<number> {
    const counter = await GeniallyCounterModel.findOne();
    return counter ? counter.count : 0;
  }

  // Increments the Genially creation counter in MongoDB
  async incrementCount(): Promise<void> {
    await GeniallyCounterModel.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }

  // Converts a MongoDB document into a Genially domain object
  private toGenially(geniallyDoc: GeniallyDocument): Genially {
    return new Genially(
      geniallyDoc.id,
      geniallyDoc.name,
      geniallyDoc.description,
      geniallyDoc.createdAt,
      geniallyDoc.modifiedAt,
      geniallyDoc.deletedAt
    );
  }
}
