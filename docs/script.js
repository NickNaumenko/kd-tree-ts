import KDTree from 'https://unpkg.com/kd-tree-ts@0.1.1-2/dist/kd-tree-ts.esm.js';

const canvas = document.getElementById('canvas');
const ui = document.getElementById('ui-level');
const ctx = canvas.getContext('2d');
const uiCtx = ui.getContext('2d');
const base = getCoords(canvas);
let tree;

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
  active = mode;
  modes[mode].subscribe();
};

function handleInsert(e) {
  e.preventDefault();
  const { pageX, pageY } = e;
  const {x, y} = offset(pageX, pageY);
  points.push(`${x} ${y}`);
  tree.insert([x, y]);
  renderTree(tree);
}

let nearest;
function handleMove(e) {
  const { pageX, pageY } = e;
  const {x, y} = offset(pageX, pageY);
  const point = tree.nearestNeighbor([x, y]);
  
  if (!nearest) {
    nearest = point;
  } else {
    if (point && ((nearest[0] !== point[0]) || (nearest[1] !== point[1]))) {
      drawPoint(nearest);
      nearest = point;
      drawHighlightedPoint(nearest);
    }
  }
}

function init() {
  tree = new KDTree();

  const insertButton = document.getElementById('insert');
  const findNearestButton = document.getElementById('find-nearest');
  const rangeSearchButton = document.getElementById('range-search');
  
  insertButton.onclick = (e) => {
    toggleMode(actions.insert);
  };
  findNearestButton.onclick = (e) => {
    toggleMode(actions.findNearest);
  };
  rangeSearchButton.onclick = (e) => {
    toggleMode(actions.rangeSearch);
  };

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

function drawPoint([x, y]) {
  const radius = 5;
  ctx.fillStyle = 'black';
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
  const radius = 5;
  ctx.fillStyle = 'orange';
  const circle = new Path2D();
  circle.arc(x, y, radius, 0, 12);
  ctx.fill(circle);
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

window.onload = () => init();
