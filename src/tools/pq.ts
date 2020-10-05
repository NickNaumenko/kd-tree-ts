export interface PqItem<T> {
  value: T;
  dist: number;
}

class PQ<T> {
  private data: T[] = [];

  constructor(readonly capacity: number, private compare: (a: T, b: T) => boolean) {}

  get size(): number {
    return this.data.length;
  }

  get values(): T[] {
    return this.data.slice(0);
  }

  get top(): T {
    return this.data[0];
  }

  siftUp(i: number): void {
    while (i > 0 && this.compare(this.data[Math.floor((i - 1) / 2)], this.data[i])) {
      const parent = Math.floor((i - 1) / 2);
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  siftDown(i: number): void {
    const n = this.data.length;

    while (i * 2 + 1 < n) {
      let max = i;

      if (this.compare(this.data[max], this.data[i * 2 + 1])) {
        max = i * 2 + 1;
      }
      if (this.compare(this.data[max], this.data[i * 2 + 2])) {
        max = i * 2 + 2;
      }
      if (max === i) break
        
      [this.data[i], this.data[max]] = [this.data[max], this.data[i]];
      i = max;
    }
  }

  push(value: T) {
    if (this.capacity > this.size) {
      this.data.push(value);
      this.siftUp(this.data.length - 1);
      return;
    }
    if (this.compare(this.top, value)) {
      return;
    }
    this.data[0] = value;
    this.siftDown(0);
  }
}

export default PQ;
