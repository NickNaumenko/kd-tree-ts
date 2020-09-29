import KDNode, { Node } from './node';
import { IPoint2D } from "./point";
import minimum from './tools/minimum';

interface IKDTree {
  root: Node;
  insert(value: IPoint2D): Node;
  delete(value: IPoint2D): boolean;
  findMin(node: Node, d: number, cd: number): Node;
  // nearestNeighbor(value: IPoint2D): Node;
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

  // nearestNeighbor(point: IPoint2D, best: number = Infinity) {
  //   if (this.root === null || KDTree.distance(point)) {

  //   }
  //   return this.root;
  // }

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

  static distance(a: IPoint2D, b: IPoint2D) {
    return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
  }
}

export default KDTree;
