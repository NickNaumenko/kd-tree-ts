import Rect from '../src/rect';
import { Rect2d } from '../src/types/rect2d';

const rectA: Rect2d = [
  [0, 0],
  [4, 3],
];
const rectB: Rect2d = [
  [2, 1],
  [5, 4],
];
const rectC: Rect2d = [
  [0, 0],
  [4, 3],
];
const rectD: Rect2d = [
  [4, 3],
  [5, 4],
];
const rectE: Rect2d = [
  [10, 10],
  [10, 10],
];
const rectF: Rect2d = [
  [-Infinity, -Infinity],
  [Infinity, Infinity],
];

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
    expect(Rect.contains(rectA, [1, 2])).toBe(true);
    expect(Rect.contains(rectA, [0, 1])).toBe(true);
    expect(Rect.contains(rectA, [4, 0])).toBe(true);
    expect(Rect.contains(rectA, [4, 3])).toBe(true);
  });
  it('Should return false if rectangle does not contain point', () => {
    expect(Rect.contains(rectA, [10, 2])).toBe(false);
    expect(Rect.contains(rectA, [0, -0.1])).toBe(false);
  });
});
