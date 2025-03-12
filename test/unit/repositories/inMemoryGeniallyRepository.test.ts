import InMemoryGeniallyRepository from "../../../src/contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import Genially from "../../../src/contexts/core/genially/domain/Genially";

describe("InMemoryGeniallyRepository", () => {
  let repository: InMemoryGeniallyRepository;

  beforeEach(() => {
    repository = new InMemoryGeniallyRepository();
  });

  describe("save()", () => {
    it("should save a Genially", async () => {
      const genially = new Genially("1", "Test Genially", "Description");
      await repository.save(genially);

      const savedGenially = await repository.find("1");
      expect(savedGenially).toBeInstanceOf(Genially);
      expect(savedGenially?.id).toBe("1");
    });
  });

  describe("find()", () => {
    it("should find a Genially by ID", async () => {
      const genially = new Genially("2", "Another Genially", "Description");
      await repository.save(genially);

      const foundGenially = await repository.find("2");
      expect(foundGenially).not.toBeNull();
      expect(foundGenially?.id).toBe("2");
    });

    it("should return null if Genially does not exist", async () => {
      const nonExistentGenially = await repository.find("999");
      expect(nonExistentGenially).toBeNull();
    });
  });

  describe("findAll()", () => {
    it("should return all stored Geniallys", async () => {
      await repository.save(new Genially("3", "First Genially", "Description"));
      await repository.save(
        new Genially("4", "Second Genially", "Description")
      );

      const allGeniallys = await repository.findAll();
      expect(allGeniallys.length).toBe(2);
    });
  });

  describe("delete()", () => {
    it("should delete a Genially by marking it as deleted", async () => {
      const genially = new Genially("5", "To be deleted", "Description");
      await repository.save(genially);
      await repository.delete("5");

      const deletedGenially = await repository.find("5");
      expect(deletedGenially?.deletedAt).not.toBeUndefined();
    });
  });
});
