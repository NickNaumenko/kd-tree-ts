import { Point2D } from './types/point2d';
import { Rect2d } from './types/rect2d';

class Rect {
  static contains(rect: Rect2d, point: Point2D): boolean {
    for (let i = 0; i < point.length; i++) {
      if (point[i] > rect[1][i] || point[i] < rect[0][i]) return false;
    }
    return true;
  }

  static intersects(rectA: Rect2d, rectB: Rect2d): boolean {
    return (
      rectA[0][0] <= rectB[1][0] &&
      rectB[0][0] <= rectA[1][0] &&
      rectA[0][1] <= rectB[1][1] &&
      rectB[0][1] <= rectA[1][1]
    );
  }

  static clone(rect: Rect2d): Rect2d {
    return [[...rect[0]], [...rect[1]]];
  }
}

export default Rect;
