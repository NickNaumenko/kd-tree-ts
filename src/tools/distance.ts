import { Point2D } from '../types/point2d';

function distance(a: Point2D, b: Point2D): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

export default distance;
