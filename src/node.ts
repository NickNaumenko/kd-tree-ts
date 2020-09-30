import { IPoint2D } from './point';

export interface INode {
  point: IPoint2D;
  left: Node;
  right: Node;
  parent: Node;
  cd: number;
}

export type Node = INode | null;

class KDNode implements INode {
  left: Node = null
  right: Node = null
  parent: Node = null
  cd: number = 0

  constructor(public point: IPoint2D, cd: number) {
    this.cd = cd;
  }

  toString() {
    return this.point.toString();
  }
}

export default KDNode;
