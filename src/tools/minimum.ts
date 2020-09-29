import { Node } from '../node';

const minimum = (a: Node, b: Node, c: Node, dimension: number): Node | null => {
  const aValue = a && a.point[dimension] || Infinity;
  const bValue = b && b.point[dimension] || Infinity;
  const cValue = c && c.point[dimension] || Infinity;
  let min = a;
  let minValue = aValue;
  if (bValue < minValue) {
    min = b;
    minValue = bValue;
  }
  if (cValue < minValue) {
    min = c;
  }
  return min;
};

export default minimum;
