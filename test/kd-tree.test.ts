import KDTree from '../src/index';
import KDNode from '../src/kdNode';
import { Point2D } from '../src/types/point2d';
import distance from '../src/tools/distance';
import { Rect2d } from '../src/types/rect2d';
const readInput = require('./tools/readInput');

const createTree = (points: Point2D[]): KDTree => {
  const tree = new KDTree();
  points.forEach(point => tree.insert(point));
  return tree;
};

describe('Insertion test', () => {
  it('should return node', () => {
    const point: Point2D = [7, 8];
    const points: Array<Point2D> = [
      [30, 40],
      [5, 25],
      [10, 12],
      [70, 70],
      [50, 30],
      [35, 45],
    ];
    const tree = createTree(points);

    expect(tree.insert(point) instanceof KDNode);
  });
});

describe('Calc distance', () => {
  it('should return distance', () => {
    const [a, b, c, d]: Array<Point2D> = [
      [2, 2],
      [6, 5],
      [3, -1],
      [6, 3],
    ];
    expect(distance(a, b)).toEqual(5);
    expect(distance(c, d)).toEqual(5);
  });
});

describe('Find nearest neighbor', () => {
  it('should return an empty array if tree is empty', () => {
    const tree = new KDTree();
    expect(tree.nearest([5, 7])).toEqual([]);
  });
  it('should return root if there is only one node', () => {
    const tree = new KDTree();
    tree.insert([100000, 1000000]);
    expect(tree.nearest([5, 7])).toEqual([[100000, 1000000]]);
  });
  it('should return node with nearest neighbor', () => {
    const points: Array<Point2D> = [
      [6, 5],
      [3, 6],
      [9, 4],
      [2, 3],
      [4, 8],
      [7, 2],
      [8, 7],
    ];
    const tree = createTree(points);
    expect(tree.nearest([9, 8])).toEqual([[8, 7]]);
    expect(tree.nearest([4, 7], 3)).toEqual(
      expect.arrayContaining([
        [4, 8],
        [3, 6],
        [6, 5],
      ])
    );
    expect(tree.nearest([6, 4], 5)).toEqual(
      expect.arrayContaining([
        [6, 5],
        [7, 2],
        [9, 4],
        [3, 6],
        [8, 7],
      ])
    );
    expect(tree.nearest([7, 5], 4)).toEqual(
      expect.arrayContaining([
        [6, 5],
        [8, 7],
        [9, 4],
        [7, 2],
      ])
    );
    expect(tree.nearest([6, 8])).toEqual([[4, 8]]);
  });
  it('should return array with nearest neighbor from unbalanced tree', () => {
    const points: Point2D[] = [
      [1, 5],
      [2, 7],
      [3, 8],
      [4, 9],
      [5, 10],
      [6, 11],
      [7, 12],
      [8, 13],
      [9, 14],
    ];
    const tree = createTree(points);
    expect(tree.nearest([4, 11])).toEqual([[5, 10]]);
    expect(tree.nearest([2, 6])).toEqual([[2, 7]]);
    expect(tree.nearest([-1, 0], 5)).toEqual(
      expect.arrayContaining([
        [1, 5],
        [2, 7],
        [3, 8],
        [4, 9],
        [5, 10],
      ])
    );
  });
  it('Should find array of nearest nodes in horizontal data set', async () => {
    const points: Point2D[] = await readInput(8, 'test/data/horizontal8.txt');
    const tree = createTree(points);
    expect(tree.nearest([1, 0.5], 4)).toEqual(
      expect.arrayContaining([
        [0.9, 0.5],
        [0.7, 0.5],
        [0.6, 0.5],
        [0.5, 0.5],
      ])
    );
  });
  it('Should find array of nearest nodes in vertical data set', async () => {
    const points: Point2D[] = await readInput(8, 'test/data/vertical7.txt');
    const tree = createTree(points);
    expect(tree.nearest([0.3, 1], 4)).toEqual(
      expect.arrayContaining([
        [0.3, 0.9],
        [0.3, 0.8],
        [0.3, 0.7],
        [0.3, 0.5],
      ])
    );
  });
});

describe('Range search', () => {
  const points: Point2D[] = [
    [6, 5],
    [3, 6],
    [9, 4],
    [2, 3],
    [4, 8],
    [7, 2],
    [8, 7],
  ];
  const tree = createTree(points);
  it('Should return array with points in range', async () => {
    const rect: Rect2d = [
      [1, 1],
      [7, 7],
    ];
    expect(tree.rangeSearch(rect)).toEqual(
      expect.arrayContaining([
        [2, 3],
        [3, 6],
        [6, 5],
        [7, 2],
      ])
    );
    const rect2: Rect2d = [
      [5, 5],
      [6, 5],
    ];
    expect(tree.rangeSearch(rect2)).toEqual(expect.arrayContaining([[6, 5]]));
    const data: Point2D[] = await readInput(61, 'test/data/input61.txt');
    const expected: Point2D[] = [
      [249, 298.125],
      [273, 276.125],
      [292, 312.125],
      [271, 313.125],
    ];
    const tree2 = createTree(data);
    const rect3: Rect2d = [
      [237, 273.125],
      [313, 327.125],
    ];
    expect(tree2.rangeSearch(rect3)).toEqual(expect.arrayContaining(expected));
  });
  it('Should return empty array if there is no matches', () => {
    const rect: Rect2d = [
      [10, 1],
      [20, 10],
    ];
    expect(tree.rangeSearch(rect)).toEqual([]);
  });
});
