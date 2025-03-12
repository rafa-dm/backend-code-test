import CreateGeniallyService from "../../../src/contexts/core/genially/application/CreateGeniallyService";
import InMemoryGeniallyRepository from "../../../src/contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import Genially from "../../../src/contexts/core/genially/domain/Genially";
import GeniallyAlreadyExists from "../../../src/contexts/core/genially/domain/errors/GeniallyAlreadyExists";
import InvalidGeniallyName from "../../../src/contexts/core/genially/domain/errors/InvalidGeniallyName";

describe("CreateGeniallyService", () => {
  let repository: InMemoryGeniallyRepository;
  let service: CreateGeniallyService;

  beforeEach(() => {
    repository = new InMemoryGeniallyRepository();
    service = new CreateGeniallyService(repository);
  });

  describe("execute()", () => {
    it("should create a new Genially successfully", async () => {
      const geniallyData = {
        id: "1",
        name: "Test Genially",
        description: "Description",
      };

      await service.execute(geniallyData);
      const genially = await repository.find("1");

      expect(genially).toBeInstanceOf(Genially);
      expect(genially?.id).toBe("1");
      expect(genially?.name).toBe("Test Genially");
    });

    it("should throw an error if the name is too short", async () => {
      const geniallyData = { id: "2", name: "Te", description: "Description" };

      await expect(service.execute(geniallyData)).rejects.toThrow(
        InvalidGeniallyName
      );
    });

    it("should throw an error if the ID already exists", async () => {
      const geniallyData = {
        id: "3",
        name: "Duplicate Genially",
        description: "Description",
      };

      await service.execute(geniallyData);

      await expect(service.execute(geniallyData)).rejects.toThrow(
        GeniallyAlreadyExists
      );
    });
  });
});
