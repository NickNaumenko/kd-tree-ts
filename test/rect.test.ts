import Rect from '../src/rect';
import { Point2D } from '../src/types/point2d';
import { Rect2d } from '../src/types/rect2d';

const rectA: Rect2d = [[0, 0], [4, 3]];
const rectB: Rect2d = [[2, 1], [5, 4]];
const rectC: Rect2d = [[0, 0], [4, 3]];
const rectD: Rect2d = [[4, 3], [5, 4]];
const rectE: Rect2d = [[10, 10], [10, 10]];
const rectF: Rect2d = [[-Infinity, -Infinity], [Infinity, Infinity]];

describe('Rect intersection', () => {
  it('Should return true if this rectangle intersects that rectangle', () => {
    expect(Rect.intersects(rectA, rectB)).toBe(true);
    expect(Rect.intersects(rectB, rectA)).toBe(true);
    expect(Rect.intersects(rectC, rectD)).toBe(true);
    expect(Rect.intersects(rectD, rectC)).toBe(true);
    expect(Rect.intersects(rectF, rectC)).toBe(true);
  });
  it('Should return false if this rectangle does not intersect that rectangle', () => {
    expect(Rect.intersects(rectE, rectB)).toBe(false);
  });
});

describe('Rect contains', () => {
  it('Should return true if rectangle contains point', () => {
    const point: Point2D = [1, 2];
    expect(Rect.contains(rectA, point)).toBe(true);
  });
  it('Should return false if rectangle does not contain point', () => {
    const point: Point2D = [10, 2];
    expect(Rect.contains(rectA, point)).toBe(false);
  });
});
