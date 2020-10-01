import KDNode, { Node } from './kdNode';
import { Point2D } from './types/point2d';
import distance from './tools/distance';
import Rect, { Rectangle } from './rect';

class KDTree {
  root: Node;
  constructor(readonly points?: Point2D[], private dimensions: number = 2) {}

  insert(point: Point2D) {
    if (!this.root) {
      this.root = new KDNode(point);
      return this.root;
    }
    let node = this.root;
    let cd = 0;
    while (node) {
      if (point[cd] < node.point[cd]) {
        cd = (cd + 1) % this.dimensions;
        if (!node.left) {
          const newNode = new KDNode(point);
          node.left = newNode;
          newNode.parent = node;
          return newNode;
        }
        node = node.left;
      } else {
        cd = (cd + 1) % this.dimensions;
        if (!node.right) {
          const newNode = new KDNode(point);
          node.right = newNode;
          newNode.parent = node;
          return newNode;
        }
        node = node.right;
      }
    }
    return node;
  }

  nearestNeighbor(point: Point2D) {
    let bestDist = Infinity;
    let result: Point2D | null = null;

    const distanceToBb = (point: Point2D, bB: KDNode, cd: number): number => {
      return Math.abs(bB.point[cd] - point[cd]);
    };

    const search = (point: Point2D, node: Node, cd: number): void => {
      if (!node) {
        return;
      }
      const curDist = distance(point, node.point);
      if (curDist < bestDist) {
        bestDist = curDist;
        result = node.point;
      }
      let first, last;
      if (point[cd] < node.point[cd]) {
        first = node.left;
        last = node.right;
      } else {
        first = node.right;
        last = node.left;
      }

      search(point, first, (cd + 1) % this.dimensions);
      const distToBb = distanceToBb(point, node, cd);
      if (distToBb < bestDist) {
        search(point, last, (cd + 1) % this.dimensions);
      }
    };

    search(point, this.root, 0);

    return result;
  }

  rangeSearch(rect: Rectangle): Point2D[] | [] {
    const searchRect = new Rect(rect.xMin, rect.yMin, rect.xMax, rect.yMax);
    const result: Point2D[] = [];

    if (!this.root) {
      return result;
    }

    const search = (
      node: Node,
      box: Rectangle = {
        xMin: -Infinity,
        yMin: -Infinity,
        xMax: Infinity,
        yMax: Infinity,
      }
    ): void => {
      if (node === undefined) {
        return;
      }
      const { point } = node;
      if (searchRect.contains(node.point)) {
        result.push(point);
      }
      const leftBox = {
        xMin: box.xMin,
        yMin: box.yMin,
        xMax: point[0],
        yMax: point[1],
      };
      const rightBox = {
        xMin: point[0],
        yMin: point[1],
        xMax: box.xMax,
        yMax: box.yMax,
      };

      if (searchRect.intersects(leftBox)) {
        search(node.left, leftBox);
      }
      if (searchRect.intersects(rightBox)) {
        search(node.right, rightBox);
      }
    };

    search(this.root);

    return result;
  }
}

export default KDTree;
