import { IPoint2D } from "../point";

function distance(a: IPoint2D, b: IPoint2D): number {
  return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
}

export default distance;
