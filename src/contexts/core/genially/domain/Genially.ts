import InvalidGeniallyDescription from "./errors/InvalidGeniallyDescription";
import InvalidGeniallyName from "./errors/InvalidGeniallyName";
import SameGeniallyName from "./errors/SameGeniallyName";
import GeniallyIsDeleted from "./errors/GeniallyIsDeleted";

export default class Genially {
  private _id: string;
  private _name: string;
  private _description: string;
  private _createdAt: Date;
  private _modifiedAt: Date;
  private _deletedAt: Date;

  constructor(
    id: string,
    name: string,
    description?: string,
    createdAt?: Date,
    modifiedAt?: Date,
    deletedAt?: Date
  ) {
    this.validateName(name);
    this.validateDescription(description);

    this._id = id;
    this._name = name;
    this._description = description;
    this._createdAt = createdAt || new Date();
    this._modifiedAt = modifiedAt;
    this._deletedAt = deletedAt;
  }

  // Validates that the name is within the allowed length
  private validateName(name: string) {
    if (!name || name.length < 3 || name.length > 20) {
      throw new InvalidGeniallyName();
    }
  }

  // Validates that the description does not exceed the character limit
  private validateDescription(description: string) {
    if (description && description.length > 125) {
      throw new InvalidGeniallyDescription();
    }
  }

  // Getters for accessing private attributes
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get modifiedAt(): Date {
    return this._modifiedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  // Marks the Genially as deleted by setting the deletion timestamp
  public delete(): void {
    this._deletedAt = new Date();
  }

  // Renames the Genially, updating its modification date
  public rename(newName: string): void {
    if (this._deletedAt) {
      throw new GeniallyIsDeleted(this._id);
    }

    if (this._name === newName) {
      throw new SameGeniallyName();
    }
    this.validateName(newName);
    this._name = newName;
    this._modifiedAt = new Date();
  }
}
