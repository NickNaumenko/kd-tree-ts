import Rect from '../src/rect';
import { Point2D } from '../src/types/point2d';

const rectA = new Rect(0, 0, 4, 3);
const rectB = new Rect(2, 1, 5, 4);
const rectC = new Rect(0, 0, 4, 3);
const rectD = new Rect(4, 3, 5, 4);
const rectE = new Rect(10, 10, 10, 10);
const rectF = new Rect(-Infinity, -Infinity, Infinity, Infinity);

describe('Rect intersection', () => {
  it('Should return true if this rectangle intersects that rectangle', () => {
    expect(rectA.intersects(rectB)).toBe(true);
    expect(rectB.intersects(rectA)).toBe(true);
    expect(rectC.intersects(rectD)).toBe(true);
    expect(rectD.intersects(rectC)).toBe(true);
    expect(rectF.intersects(rectC)).toBe(true);
  });
  it('Should return false if this rectangle does not intersect that rectangle', () => {
    expect(rectE.intersects(rectB)).toBe(false);
  });
});

describe('Rect contains', () => {
  it('Should return true if rectangle contains point', () => {
    const point: Point2D = [1, 2];
    expect(rectA.contains(point)).toBe(true);
  });
  it('Should return false if rectangle does not contain point', () => {
    const point: Point2D = [10, 2];
    expect(rectA.contains(point)).toBe(false);
  });
});
