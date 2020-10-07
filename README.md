# KD-tree
A base implementation of kd-tree

```js
const { default: KDTree } = require("kd-tree-ts");

// create new tree
const tree = new KDTree;

// insert point 
tree.insert(point);

// find nearest neighbor
tree.nearest(point, k);

// range search
tree.rangeSearch(range);
```