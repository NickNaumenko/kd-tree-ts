export interface PqItem<T> {
  value: T;
  priority: number;
}

class PQ<T> {
  private data: PqItem<T>[] = [];
  private lessThan(a: PqItem<T>, b: PqItem<T>): boolean {
    if (!b) return false;
    return a.priority < b.priority;
  }

  constructor(readonly capacity: number) {}

  get size(): number {
    return this.data.length;
  }

  get values(): T[] {
    return this.data.map(({ value }) => value);
  }

  get top(): PqItem<T> {
    return this.data[0];
  }

  get maxPriority(): number {
    return this.data[0] && this.data[0].priority;
  }

  siftUp(i: number): void {
    while (
      i > 0 &&
      this.lessThan(this.data[Math.floor((i - 1) / 2)], this.data[i])
    ) {
      const parent = Math.floor((i - 1) / 2);
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  siftDown(i: number): void {
    const n = this.data.length;

    while (i * 2 + 1 < n) {
      let max = i;

      if (this.lessThan(this.data[max], this.data[i * 2 + 1])) {
        max = i * 2 + 1;
      }
      if (this.lessThan(this.data[max], this.data[i * 2 + 2])) {
        max = i * 2 + 2;
      }
      if (max === i) break;

      [this.data[i], this.data[max]] = [this.data[max], this.data[i]];
      i = max;
    }
  }

  push(value: PqItem<T>) {
    if (this.capacity > this.size) {
      this.data.push(value);
      this.siftUp(this.data.length - 1);
      return;
    }
    if (this.lessThan(this.top, value)) {
      return;
    }
    this.data[0] = value;
    this.siftDown(0);
  }
}

export default PQ;
