// ===== GRAPH ALGORITHMS =====

export function bfsSteps(nodes, adjacency, startId) {
  const steps = [];
  const visited = new Set();
  const queue = [startId];
  visited.add(startId);

  steps.push({ visited: new Set(), current: null, queue: [startId], stack: null, path: [], label: `Start BFS from node ${startId}` });

  while (queue.length > 0) {
    const current = queue.shift();
    steps.push({ visited: new Set(visited), current, queue: [...queue], stack: null, path: [], label: `Visit node ${current}, dequeue from front` });

    const neighbors = (adjacency[current] || []).map(e => e.to).filter(n => !visited.has(n));
    for (const neighbor of neighbors) {
      visited.add(neighbor);
      queue.push(neighbor);
      steps.push({ visited: new Set(visited), current, queue: [...queue], stack: null, path: [], label: `Discover neighbor ${neighbor}, add to queue` });
    }
  }

  steps.push({ visited: new Set(visited), current: null, queue: [], stack: null, path: [...visited], label: `BFS complete! Visited: ${[...visited].join(' → ')}` });
  return steps;
}

export function dfsSteps(nodes, adjacency, startId) {
  const steps = [];
  const visited = new Set();
  const stack = [startId];
  const order = [];

  steps.push({ visited: new Set(), current: null, queue: null, stack: [...stack], path: [], label: `Start DFS from node ${startId}` });

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);
    steps.push({ visited: new Set(visited), current, queue: null, stack: [...stack], path: [...order], label: `Visit node ${current}, pop from stack` });

    const neighbors = (adjacency[current] || []).map(e => e.to).filter(n => !visited.has(n)).reverse();
    for (const neighbor of neighbors) {
      stack.push(neighbor);
      steps.push({ visited: new Set(visited), current, queue: null, stack: [...stack], path: [...order], label: `Push unvisited neighbor ${neighbor} to stack` });
    }
  }

  steps.push({ visited: new Set(visited), current: null, queue: null, stack: [], path: [...order], label: `DFS complete! Order: ${order.join(' → ')}` });
  return steps;
}

export function dijkstraSteps(nodes, adjacency, startId) {
  const steps = [];
  const dist = {};
  const prev = {};
  const unvisited = new Set(nodes.map(n => n.id));
  const visited = new Set();

  nodes.forEach(n => { dist[n.id] = n.id === startId ? 0 : Infinity; prev[n.id] = null; });

  steps.push({ dist: {...dist}, visited: new Set(), current: null, path: [], label: `Init: distance to ${startId}=0, all others=∞` });

  while (unvisited.size > 0) {
    // Pick min distance unvisited
    let u = null;
    for (const id of unvisited) {
      if (u === null || dist[id] < dist[u]) u = id;
    }
    if (dist[u] === Infinity) break;

    unvisited.delete(u);
    visited.add(u);

    steps.push({ dist: {...dist}, visited: new Set(visited), current: u, path: [], label: `Process node ${u} (dist=${dist[u]})` });

    for (const edge of (adjacency[u] || [])) {
      const v = edge.to;
      const alt = dist[u] + edge.weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        steps.push({ dist: {...dist}, visited: new Set(visited), current: u, relaxed: v, path: [], label: `Relax edge ${u}→${v}: dist[${v}] updated to ${alt}` });
      } else {
        steps.push({ dist: {...dist}, visited: new Set(visited), current: u, path: [], label: `Edge ${u}→${v}: no improvement (${alt} ≥ ${dist[v]})` });
      }
    }
  }

  steps.push({ dist: {...dist}, visited: new Set(visited), current: null, path: [], label: `Dijkstra complete! Shortest distances from ${startId}: ${Object.entries(dist).map(([k,v])=>`${k}:${v===Infinity?'∞':v}`).join(', ')}` });
  return { steps, dist, prev };
}

export function getShortestPath(prev, startId, endId) {
  const path = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }
  if (path[0] !== startId) return [];
  return path;
}
