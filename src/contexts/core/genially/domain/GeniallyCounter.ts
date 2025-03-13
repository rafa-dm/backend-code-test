export default class GeniallyCounter {
  private count: number;

  // Initialized to 0 to persistence
  constructor(initialCount = 0) {
    this.count = initialCount;
  }

  // Increments the counter by 1 when a new Genially is created
  increment(): void {
    this.count++;
  }

  // Returns the total count of created Geniallys
  getCount(): number {
    return this.count;
  }
}
