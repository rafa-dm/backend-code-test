import RenameGeniallyService from "../../../src/contexts/core/genially/application/RenameGeniallyService";
import InMemoryGeniallyRepository from "../../../src/contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import Genially from "../../../src/contexts/core/genially/domain/Genially";
import GeniallyNotExist from "../../../src/contexts/core/genially/domain/errors/GeniallyNotExist";
import InvalidGeniallyName from "../../../src/contexts/core/genially/domain/errors/InvalidGeniallyName";
import GeniallyIsDeleted from "../../../src/contexts/core/genially/domain/errors/GeniallyIsDeleted";
import SameGeniallyName from "../../../src/contexts/core/genially/domain/errors/SameGeniallyName";

describe("RenameGeniallyService", () => {
  let repository: InMemoryGeniallyRepository;
  let service: RenameGeniallyService;

  beforeEach(() => {
    repository = new InMemoryGeniallyRepository();
    service = new RenameGeniallyService(repository);
  });

  describe("execute()", () => {
    it("should rename an existing Genially successfully", async () => {
      const geniallyData = {
        id: "1",
        name: "Test Genially",
        description: "Description",
      };
      const genially = new Genially(
        geniallyData.id,
        geniallyData.name,
        geniallyData.description
      );
      await repository.save(genially);

      await service.execute({ id: "1", newName: "Updated Genially" });

      const updatedGenially = await repository.find("1");
      expect(updatedGenially?.name).toBe("Updated Genially");
      expect(updatedGenially?.modifiedAt).not.toBeUndefined();
    });

    it("should throw an error if the Genially does not exist", async () => {
      await expect(
        service.execute({ id: "999", newName: "New Name" })
      ).rejects.toThrow(GeniallyNotExist);
    });

    it("should throw an error if the new name is too short", async () => {
      const geniallyData = {
        id: "2",
        name: "Valid Name",
        description: "Description",
      };
      const genially = new Genially(
        geniallyData.id,
        geniallyData.name,
        geniallyData.description
      );
      await repository.save(genially);

      await expect(service.execute({ id: "2", newName: "Te" })).rejects.toThrow(
        InvalidGeniallyName
      );
    });

    it("should throw an error if the Genially is already deleted", async () => {
      const geniallyData = {
        id: "3",
        name: "Active Genially",
        description: "Description",
      };
      const genially = new Genially(
        geniallyData.id,
        geniallyData.name,
        geniallyData.description
      );
      genially.delete();
      await repository.save(genially);

      await expect(
        service.execute({ id: "3", newName: "New Name" })
      ).rejects.toThrow(GeniallyIsDeleted);
    });

    it("should throw an error if the new name is the same as the current name", async () => {
      const geniallyData = {
        id: "4",
        name: "Same Name",
        description: "Description",
      };
      const genially = new Genially(
        geniallyData.id,
        geniallyData.name,
        geniallyData.description
      );
      await repository.save(genially);

      await expect(
        service.execute({ id: "4", newName: "Same Name" })
      ).rejects.toThrow(SameGeniallyName);
    });
  });
});
