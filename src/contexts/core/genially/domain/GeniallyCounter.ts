export default class GeniallyCounter {
  private count: number;

  // Initialized to 0 to persistence
  constructor(initialCount = 0) {
    this.count = initialCount;
  }

  increment(): void {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}
