import KDNode, { Node } from './node';
import { IPoint2D } from "./point";
import distance from './tools/distance';
import minimum from './tools/minimum';

interface IKDTree {
  root: Node;
  insert(value: IPoint2D): Node;
  findMin(node: Node, d: number, cd: number): Node;
  nearestNeighbor(value: IPoint2D): IPoint2D | null;
}

class KDTree implements IKDTree {
  root: Node = null
  constructor(readonly points?: Array<IPoint2D>, private dimensions: number = 2) {}

  insert(point: IPoint2D) {
    if (this.root === null) {
      this.root = new KDNode(point, 0);
      return this.root;
    }
    let node = this.root;
    let cd = 0;
    while (node) {
      if (point[cd] < node.point[cd]) {
        cd = (cd + 1) % this.dimensions;
        if (!node.left) {
          const newNode = new KDNode(point, cd);
          node.left = newNode;
          newNode.parent = node;
          return newNode;
        }
        node = node.left;
      } else {
        cd = (cd + 1) % this.dimensions;
        if (!node.right) {
          const newNode = new KDNode(point, cd);
          node.right = newNode;
          newNode.parent = node;
          return newNode;
        }
        node = node.right;
      }
    }
    return node;
  }

  nearestNeighbor(point: IPoint2D) {
    let bestDist = Infinity;
    let result: IPoint2D | null = null;
  
    const distanceToBb = (point: IPoint2D, bB: KDNode, cd: number): number => {
      return Math.abs(bB.point[cd] - point[cd]);
    };

    const search = (point: IPoint2D, node: Node, cd: number): void => {
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

  findMin(node: Node = this.root, dimension: number, cd: number = 0): any {
    if (node === null) {
      return null;
    }
    if (dimension === cd) {
      if (node.left === null) {
        return node;
      }
      cd = (cd + 1) % this.dimensions;
      return this.findMin(node.left, dimension, cd);
    }
    cd = (cd + 1) % this.dimensions;
    
    const left: Node = this.findMin(node.left, dimension, cd);
    const right: Node = this.findMin(node.right, dimension, cd);

    return minimum(node, left, right, dimension);
  }
}

export default KDTree;
