export const traverseTree = <T extends { children?: T[] }>(
  nodes: T[],
  onVisit: (node: T) => void,
): void => {
  nodes.forEach((node) => {
    onVisit(node);
    if (node.children?.length) {
      traverseTree(node.children, onVisit);
    }
  });
};

export const collectLeafNodes = <T extends { children?: T[] }>(
  nodes: T[],
): T[] => {
  const leafNodes: T[] = [];

  traverseTree(nodes, (node) => {
    if (!node.children?.length) {
      leafNodes.push(node);
    }
  });

  return leafNodes;
};

export const collectNonLeafNodeIds = <T extends { id: string; children?: T[] }>(
  nodes: T[],
): Set<string> => {
  const nonLeafIds = new Set<string>();

  traverseTree(nodes, (node) => {
    if (node.children?.length) {
      nonLeafIds.add(node.id);
    }
  });

  return nonLeafIds;
};
