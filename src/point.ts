// export interface IPoint2D {
//   readonly x: number;
//   readonly y: number;

//   distanceSquaredTo(point: IPoint2D): number;
//   equal(point: IPoint2D): boolean
//   toString(): string;
// }

export type IPoint2D = [number, number];

class Point2D {
  readonly point: IPoint2D = [0, 0];
  constructor(x: number, y: number) {
    this.point[0] = x;
    this.point[1] = y;
  }

  distanceSquaredTo(point: IPoint2D) {
    return Math.sqrt(Math.pow((point[0] + this.point[0]), 2) + Math.pow((point[1] + this.point[1]), 2));
  }

  equal(point: IPoint2D) {
    return this.point[0] === point[0] && this.point[0] === point[0];
  }

  toString() {
    return this.point.toString();
  }
}

export default Point2D;
