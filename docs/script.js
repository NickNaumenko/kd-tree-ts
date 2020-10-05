// import KDTree from 'https://unpkg.com/kd-tree-ts@0.1.1-2/dist/kd-tree-ts.esm.js';
import KDTree from '../dist/kd-tree-ts.esm.js';

const canvas = document.getElementById('canvas');
const ui = document.getElementById('ui-level');
const ctx = canvas.getContext('2d');
const uiCtx = ui.getContext('2d');
const base = getCoords(canvas);
const treeCanvas = document.getElementById('tree');
const treeCtx = treeCanvas.getContext('2d');
const kInput = document.getElementById('k-count');
const resetButton = document.getElementById('reset');
let tree;
let nearest = [];

let startX, startY;

const points = [];

const actions = {
  insert: 'insert',
  findNearest: 'findNearest',
  rangeSearch: 'rangeSearch',
};

let active = actions.insert;

const insert = {
  subscribe() {
    ui.addEventListener('click', handleInsert);
  },
  unsubscribe() {
    ui.removeEventListener('click', handleInsert);
  }
};

const findNearest = {
  subscribe() {
    document.addEventListener('mousemove', handleMove);
  },
  unsubscribe() {
    document.removeEventListener('mousemove', handleMove);
  }
};

const rangeSearch = {
  subscribe() {
    ui.addEventListener('mousedown', handleStartSelection);
  },
  unsubscribe() {
    document.removeEventListener('mousemove', drawSelection);
    document.removeEventListener('mouseup', handleEndSelection);
    ui.removeEventListener('mousedown', handleStartSelection);
    uiCtx.clearRect(0, 0, ui.width, ui.height);
    renderTree(tree);
  }
};

const modes = { insert, findNearest, rangeSearch };

const toggleMode = (mode) => {
  modes[active].unsubscribe();
  document.getElementById(active).disabled = false;
  active = mode;
  modes[mode].subscribe();
  document.getElementById(active).disabled = true;
};

function handleInsert(e) {
  e.preventDefault();
  const { pageX, pageY } = e;
  const {x, y} = offset(pageX, pageY);
  points.push(`${x} ${y}`);
  tree.insert([x, y]);
  renderTree(tree);
  renderBinaryTree(tree);
}

function handleMove(e) {
  const { pageX, pageY } = e;
  const {x, y} = offset(pageX, pageY);
  removeSelection(nearest);
  const k = kInput.value || 1;
  nearest = tree.nearest([x, y], k);  

  highlightSelected(nearest);
}

function removeSelection(arr) {
  arr.forEach(point => {
    drawPoint(point);
  })
}

function handleReset() {
  tree = new KDTree();
  nearest = [];
  renderTree(tree);
  renderBinaryTree(tree);
}

function init() {
  const width = document.getElementById("wrapper").clientWidth;
  const fieldWidth = width;
  ui.width = fieldWidth;
  canvas.width = fieldWidth;
  treeCanvas.width = fieldWidth;
  tree = new KDTree();

  const insertButton = document.getElementById('insert');
  const findNearestButton = document.getElementById('findNearest');
  const rangeSearchButton = document.getElementById('rangeSearch');
  
  insertButton.onclick = (e) => {
    toggleMode(actions.insert);
  };
  findNearestButton.onclick = (e) => {
    toggleMode(actions.findNearest);
  };
  rangeSearchButton.onclick = (e) => {
    toggleMode(actions.rangeSearch);
  };

  resetButton.onclick = handleReset;

  modes[active].subscribe();
}

function getCoords(elem) {
  const box = elem.getBoundingClientRect();
  return {
    y: box.top + pageYOffset + elem.clientLeft,
    x: box.left + pageXOffset + elem.clientTop,
  };
}

function offset(x, y) {
  return {
    x: x - base.x,
    y: y - base.y,
  };
}

function handleStartSelection(e) {
  e.preventDefault();
  renderTree(tree);
  const { pageX, pageY } = e;
  const { x, y } = offset(pageX, pageY);
  startX = x;
  startY = y;

  document.addEventListener('mousemove', drawSelection);
  document.addEventListener('mouseup', handleEndSelection);
};

function handleEndSelection(e) {
  e.preventDefault();  
  const { pageX, pageY } = e;
  const { x, y } = offset(pageX, pageY);
  let xMin, xMax, yMin, yMax;
  if (x < startX) {
    xMin = x;
    xMax = startX;
  } else {
    xMin = startX;
    xMax = x;
  }
  if (y < startY) {
    yMin = y;
    yMax = startY;
  } else {
    yMin = startY;
    yMax = y;
  }

  const result = tree.rangeSearch([[xMin, yMin], [xMax, yMax]]);
  document.removeEventListener('mousemove', drawSelection);
  highlightSelected(result);
}

function drawSelection(e) {
  e.preventDefault();  
  const { pageX, pageY } = e;
  const { x, y } = offset(pageX, pageY);
  uiCtx.clearRect(0, 0, ui.width, ui.height);
  uiCtx.strokeStyle = 'orange';

  const width = x - startX;
  const height = y - startY;

  uiCtx.strokeRect(startX, startY, width, height);
}

function drawPoint([x, y], color = 'black') {
  const radius = 4;
  ctx.fillStyle = color;
  const circle = new Path2D();
  circle.arc(x, y, radius, 0, 12);
  ctx.fill(circle);
}

function highlightSelected(selected) {
  selected.forEach(element => {
    drawHighlightedPoint(element);
  });
}

function drawHighlightedPoint([x, y]) {
  drawPoint([x, y], 'orange');
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawVertical(point, box) {
  ctx.strokeStyle = 'red';
  const line = new Path2D();
  line.moveTo(point[0], box[0][1]);
  line.lineTo(point[0], box[1][1]);
  ctx.stroke(line);
}

function drawHorizontal(point, box) {
  ctx.strokeStyle = 'blue';
  const line = new Path2D();
  line.moveTo(box[0][0], point[1]);
  line.lineTo(box[1][0], point[1]);
  ctx.stroke(line);
}

function renderTree(tree) {
  const dim = 2;
  clearCanvas();

  const render = (node, box = [[0, 0], [canvas.width, canvas.height]], cd = 0) => {
    if (!node) {
      return;
    }
    let boxLeft, boxRight;
    if (cd === 0) {
      drawVertical(node.point, box);
      boxLeft = [
        [...box[0]],
        [node.point[0], box[1][1]]
      ];
      boxRight = [
        [node.point[0], box[0][1]],
        [...box[1]]
      ]
    } else {
      drawHorizontal(node.point, box);
      boxLeft = [
        [...box[0]],
        [box[1][0], node.point[1]]
      ];
      boxRight = [
        [box[0][0], node.point[1]],
        [...box[1]]
      ]
    }
    drawPoint(node.point);


    cd = (cd + 1) % 2;
    render(node.left, boxLeft, cd);
    render(node.right, boxRight, cd);
  }

  render(tree.root);
}

// building tree

function clearTree() {
  treeCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
}

function getTreeHeight(node, height = 0) {
  if (node) {
    height++;

    height = Math.max(
      height,
      getTreeHeight(node.left, height) || 0,
      getTreeHeight(node.right, height)
    );
  }
  return height;
}

function renderBinaryTree(tree) {
  const dim = 2;
  const width = treeCanvas.width;
  const height = treeCanvas.height;
  const treeHeight = getTreeHeight(tree.root);
  let step = (height - 5) / treeHeight;

  clearTree();

  const render = (node, cd = 0, [left = 0, right = width] = [], prev) => {
    if (!node) {
      return;
    }

    const color = cd === 0 ? 'red' : 'blue';

    let x = (right + left) / 2;
    let y = prev ? prev[1] + step : 5;

    drawNode([x, y], color, prev);

    cd = (cd + 1) % dim;
    if (node.left) {
      render(node.left, cd, [left, x], [x, y]);
    }
    if (node.right) {
      render(node.right, cd, [x, right], [x, y]);
    }
  }

  render(tree.root);
}

function drawNode([x, y], color, prev) {
  if (prev !== undefined) {
    const edge = new Path2D();
    edge.moveTo(prev[0], prev[1]);
    edge.lineTo(x, y);
    treeCtx.setLineDash([1, 4]);
    treeCtx.strokeStyle = 'darkcyan';
    treeCtx.stroke(edge);
  } 
  const radius = 4;
  treeCtx.fillStyle = color;
  const circle = new Path2D();
  circle.arc(x, y, radius, 0, 12);
  treeCtx.fill(circle); 
}



window.onload = () => init();
