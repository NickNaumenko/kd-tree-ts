import KDNode, { Node } from './node';
import { IPoint2D } from "./point";

interface IKDTree {
  insert(value: IPoint2D): Node;
  delete(value: IPoint2D): boolean;
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

  delete(value: IPoint2D) {
    return value === null;
  }
}

export default KDTree;
