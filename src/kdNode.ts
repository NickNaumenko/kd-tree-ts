import { Point2D } from './types/point2d';

export interface INode {
  point: Point2D;
  left: Node;
  right: Node;
  parent: Node;
}

export type Node = INode | undefined;

class KDNode implements INode {
  left: Node;
  right: Node;
  parent: Node;

  constructor(public point: Point2D) {}

  toString() {
    return this.point.toString();
  }
}

export default KDNode;
