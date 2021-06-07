let graph = createGraph();

const listNodeDetected = listNode.map((item) => {
  return { x: item.lat, y: item.lng };
});

listNodeDetected.forEach((item, index) => graph.addNode(`${index + 1}`, item));
for (const [key, value] of Object.entries(listLink)) {
  value.forEach(item => graph.addLink(`${key}`, `${item}`));
}

function findPath(start, end) {
  startDetected = detectPosition(start);
  endDetected = detectPosition(end);
  startNode = findNearestNode(startDetected);
  endNode = findNearestNode(endDetected);

  // Find path by astar
  let pathFinder = ngraphPath.aStar(graph, {
    distance(fromNode, toNode) {
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;

      return Math.sqrt(dx * dx + dy * dy);
    },
  });

  const route = pathFinder.find(startNode.id, endNode.id);
  const resultPath = route.reverse().map((item) => {
    return { lat: item.data.x, lng: item.data.y };
  });
  resultPath.push(end);
  let resultPathReverse = resultPath.reverse();
  resultPathReverse.push(start);
  return resultPathReverse.reverse();
}

function detectPosition(position) {
  return { x: position.lat, y: position.lng };
}

function findNearestNode(nodeFind) {
  let minDistance = 0;
  let foundNode;
  graph.forEachNode(function (node) {
    distance = calculateDistance(node.data, nodeFind);
    if (minDistance === 0 || distance < minDistance) {
      minDistance = distance;
      foundNode = node;
    }
  });
  return foundNode;
}

function calculateDistance(fromNode, toNode) {
  let dx = fromNode.x - toNode.x;
  let dy = fromNode.y - toNode.y;

  return Math.sqrt(dx * dx + dy * dy);
}
