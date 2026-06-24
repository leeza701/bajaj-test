function processHierarchy(edges) {
  console.log("Received:", edges);
  const invalidEntries = [];
  const duplicateEdges = [];

  const adjacency = {};
  const childParent = {};
  const nodes = new Set();

  const seenEdges = new Set();
  const duplicateTracker = new Set();

  for (let raw of edges) {
    let edge = String(raw).trim();

    if (!/^[A-Z]->[A-Z]$/.test(edge)) {
      invalidEntries.push(raw);
      continue;
    }

    const [parent, child] = edge.split("->");

    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    if (seenEdges.has(edge)) {
      if (!duplicateTracker.has(edge)) {
        duplicateEdges.push(edge);
        duplicateTracker.add(edge);
      }
      continue;
    }

    seenEdges.add(edge);



    if (childParent[child]) {
      continue;
    }

    childParent[child] = parent;

    if (!adjacency[parent]) {
      adjacency[parent] = [];
    }

    adjacency[parent].push(child);

    nodes.add(parent);
    nodes.add(child);
  }

  
  const visitedComponent = new Set();
  const components = [];

  const undirected = {};

  for (const node of nodes) {
    undirected[node] = [];
  }

  for (const parent in adjacency) {
    for (const child of adjacency[parent]) {
      undirected[parent].push(child);
      undirected[child].push(parent);
    }
  }

  for (const node of nodes) {
    if (visitedComponent.has(node)) continue;

    const stack = [node];
    const component = [];

    visitedComponent.add(node);

    while (stack.length) {
      const current = stack.pop();

      component.push(current);

      for (const neighbor of undirected[current]) {
        if (!visitedComponent.has(neighbor)) {
          visitedComponent.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    components.push(component);
  }


  function detectCycle(node, visited, recStack) {
    visited.add(node);
    recStack.add(node);

    const children = adjacency[node] || [];

    for (const child of children) {
      if (!visited.has(child)) {
        if (detectCycle(child, visited, recStack)) {
          return true;
        }
      } else if (recStack.has(child)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  function buildTree(node) {
    const result = {};

    const children = adjacency[node] || [];

    for (const child of children) {
      result[child] = buildTree(child);
    }

    return result;
  }

  function calculateDepth(node) {
    const children = adjacency[node] || [];

    if (children.length === 0) return 1;

    let maxDepth = 0;

    for (const child of children) {
      maxDepth = Math.max(maxDepth, calculateDepth(child));
    }

    return maxDepth + 1;
  }

  
  const hierarchies = [];

  let totalTrees = 0;
  let totalCycles = 0;

  let largestDepth = -1;
  let largestTreeRoot = "";

  for (const component of components) {
    const componentSet = new Set(component);


    let roots = component.filter(
      node => !component.some(other =>
        (adjacency[other] || []).includes(node)
      )
    );

    let root;

    if (roots.length === 0) {
      root = [...component].sort()[0];
    } else {
      root = roots.sort()[0];
    }

   
    let hasCycle = false;

    const visited = new Set();
    const recStack = new Set();

    for (const node of component) {
      if (!visited.has(node)) {
        if (detectCycle(node, visited, recStack)) {
          hasCycle = true;
          break;
        }
      }
    }

    if (hasCycle) {
      totalCycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });

      continue;
    }

  

    totalTrees++;

    const depth = calculateDepth(root);

    if (
      depth > largestDepth ||
      (depth === largestDepth &&
        root < largestTreeRoot)
    ) {
      largestDepth = depth;
      largestTreeRoot = root;
    }

    hierarchies.push({
      root,
      tree: {
        [root]: buildTree(root),
      },
      depth,
    });
  }
  console.log("COMPONENTS:", components);
console.log("NODES:", [...nodes]);
console.log("ADJACENCY:", adjacency);

  return {

    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root:
        totalTrees > 0 ? largestTreeRoot : "",
    },
  };
}

module.exports = {
  processHierarchy,
};