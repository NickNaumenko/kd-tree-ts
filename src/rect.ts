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
    for (let i = 0; i < rectA[0].length; i++) {
      if (rectA[0][i] > rectB[1][i] || rectA[1][i] < rectB[0][i]) {
        return false;
      }
    }
    return true;
  }

  static clone(rect: Rect2d): Rect2d {
    return [[...rect[0]], [...rect[1]]];
  }
}

export default Rect;
