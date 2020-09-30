'use strict';

var KDNode = /*#__PURE__*/function () {
  function KDNode(point, cd) {
    this.point = point;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.cd = 0;
    this.cd = cd;
  }

  var _proto = KDNode.prototype;

  _proto.toString = function toString() {
    return this.point.toString();
  };

  return KDNode;
}();

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

var minimum = function minimum(a, b, c, dimension) {
  var aValue = a && a.point[dimension] || Infinity;
  var bValue = b && b.point[dimension] || Infinity;
  var cValue = c && c.point[dimension] || Infinity;
  var min = a;
  var minValue = aValue;

  if (bValue < minValue) {
    min = b;
    minValue = bValue;
  }

  if (cValue < minValue) {
    min = c;
  }

  return min;
};

var KDTree = /*#__PURE__*/function () {
  function KDTree(points, dimensions) {
    if (dimensions === void 0) {
      dimensions = 2;
    }

    this.points = points;
    this.dimensions = dimensions;
    this.root = null;
  }

  var _proto = KDTree.prototype;

  _proto.insert = function insert(point) {
    if (this.root === null) {
      this.root = new KDNode(point, 0);
      return this.root;
    }

    var node = this.root;
    var cd = 0;

    while (node) {
      if (point[cd] < node.point[cd]) {
        cd = (cd + 1) % this.dimensions;

        if (!node.left) {
          var newNode = new KDNode(point, cd);
          node.left = newNode;
          newNode.parent = node;
          return newNode;
        }

        node = node.left;
      } else {
        cd = (cd + 1) % this.dimensions;

        if (!node.right) {
          var _newNode = new KDNode(point, cd);

          node.right = _newNode;
          _newNode.parent = node;
          return _newNode;
        }

        node = node.right;
      }
    }

    return node;
  };

  _proto.nearestNeighbor = function nearestNeighbor(point) {
    var _this = this;

    var bestDist = Infinity;
    var result = null;

    var distanceToBb = function distanceToBb(point, bB, cd) {
      return Math.abs(bB.point[cd] - point[cd]);
    };

    var search = function search(point, node, cd) {
      if (!node) {
        return;
      }

      var curDist = distance(point, node.point);

      if (curDist < bestDist) {
        bestDist = curDist;
        result = node.point;
      }

      var first, last;

      if (point[cd] < node.point[cd]) {
        first = node.left;
        last = node.right;
      } else {
        first = node.right;
        last = node.left;
      }

      search(point, first, (cd + 1) % _this.dimensions);
      var distToBb = distanceToBb(point, node, cd);

      if (distToBb < bestDist) {
        search(point, last, (cd + 1) % _this.dimensions);
      }
    };

    search(point, this.root, 0);
    return result;
  };

  _proto.findMin = function findMin(node, dimension, cd) {
    if (node === void 0) {
      node = this.root;
    }

    if (cd === void 0) {
      cd = 0;
    }

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
    var left = this.findMin(node.left, dimension, cd);
    var right = this.findMin(node.right, dimension, cd);
    return minimum(node, left, right, dimension);
  };

  return KDTree;
}();
