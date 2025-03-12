import mongoose, { Document, Schema } from "mongoose";
import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

interface GeniallyDocument extends Document {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  modifiedAt?: Date;
  deletedAt?: Date;
}

const GeniallySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date },
  deletedAt: { type: Date },
});

const GeniallyModel = mongoose.model<GeniallyDocument>(
  "Genially",
  GeniallySchema
);

export default class MongoGeniallyRepository implements GeniallyRepository {
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

  async delete(id: string): Promise<void> {
    await GeniallyModel.findOneAndUpdate({ id }, { deletedAt: new Date() });
  }

  async find(id: string): Promise<Genially> {
    const geniallyDoc = await GeniallyModel.findOne({ id });
    return geniallyDoc ? this.toGenially(geniallyDoc) : null;
  }

  async findAll(): Promise<Genially[]> {
    const geniallys = await GeniallyModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });
    return geniallys.map(this.toGenially);
  }

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
