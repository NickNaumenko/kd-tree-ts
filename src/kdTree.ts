import KDNode, { Node } from './kdNode';
import { Point2D } from "./types/point";
import distance from './tools/distance';

class KDTree {
  root: Node
  constructor(readonly points?: Array<Point2D>, private dimensions: number = 2) {}

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
}

export default KDTree;
