import { Point2D } from './types/point2d';

export interface Rectangle {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

class Rect implements Rectangle {
  constructor(
    readonly xMin: number,
    readonly yMin: number,
    readonly xMax: number,
    readonly yMax: number
  ) {}

  contains(point: Point2D): boolean {
    return (
      point[0] <= this.xMax &&
      point[1] <= this.yMax &&
      point[0] >= this.xMin &&
      point[1] >= this.yMin
    );
  }

  distanceTo(point: Point2D): number {
    const dx = Math.max(this.xMin - point[0], point[0] - this.xMax);
    const dy = Math.max(this.yMin - point[1], point[1] - this.yMax);
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  intersects(rect: Rectangle): boolean {
    return (
      rect.xMin <= this.xMax &&
      this.xMin <= rect.xMax &&
      rect.yMin <= this.yMax &&
      this.yMin <= rect.yMax
    );
  }
}

export default Rect;
