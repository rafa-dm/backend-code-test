import DeleteGeniallyService from "../../../src/contexts/core/genially/application/DeleteGeniallyService";
import InMemoryGeniallyRepository from "../../../src/contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import Genially from "../../../src/contexts/core/genially/domain/Genially";
import GeniallyNotExist from "../../../src/contexts/core/genially/domain/errors/GeniallyNotExist";

describe("DeleteGeniallyService", () => {
  let repository: InMemoryGeniallyRepository;
  let service: DeleteGeniallyService;

  beforeEach(() => {
    repository = new InMemoryGeniallyRepository();
    service = new DeleteGeniallyService(repository);
  });

  describe("execute()", () => {
    it("should delete an existing Genially successfully", async () => {
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

      await service.execute({ id: "1" });

      const deletedGenially = await repository.find("1");
      expect(deletedGenially).not.toBeNull();
      expect(deletedGenially?.deletedAt).not.toBeUndefined();
    });

    it("should throw an error if the Genially does not exist", async () => {
      await expect(service.execute({ id: "999" })).rejects.toThrow(
        GeniallyNotExist
      );
    });
  });
});
