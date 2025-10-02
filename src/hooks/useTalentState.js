import { useState, useCallback, useMemo } from 'react';
// TypeScript types removed for JavaScript compatibility

export const useTalentState = (initialTree) => {
  // Initialize state from tree
  const initializeState = useCallback(() => {
    const nodes = new Map();

    initialTree.nodes.forEach(node => {
      nodes.set(node.id, {
        id: node.id,
        currentRank: 0,
        maxRank: node.maxRank,
        prerequisites: node.prerequisites || [],
        locked: node.locked || false,
        available: node.available || false
      });
    });

    return {
      nodes,
      totalPoints: 0,
      maxPoints: initialTree.config.maxPoints
    };
  }, [initialTree]);

  const [state, setState] = useState(initializeState);

  // Check if all prerequisites are met
  const checkPrerequisites = useCallback((nodeId) => {
    const node = state.nodes.get(nodeId);
    if (!node) return false;

    // Check if node is locked
    if (node.locked) return false;

    // Check all prerequisites have at least 1 rank
    return node.prerequisites.every(prereqId => {
      const prereq = state.nodes.get(prereqId);
      return prereq && prereq.currentRank > 0;
    });
  }, [state]);

  // Get all talents that depend on this one
  const getDependents = useCallback((nodeId) => {
    const dependents = [];

    state.nodes.forEach((node, id) => {
      if (node.prerequisites.includes(nodeId)) {
        dependents.push(id);
      }
    });

    return dependents;
  }, [state]);

  // Check if we can allocate a point to this talent
  const canAllocate = useCallback((nodeId) => {
    const node = state.nodes.get(nodeId);
    if (!node) return false;

    // Check basic conditions
    if (node.currentRank >= node.maxRank) return false;
    if (state.totalPoints >= state.maxPoints) return false;
    if (node.locked) return false;

    // Check prerequisites
    return checkPrerequisites(nodeId);
  }, [state, checkPrerequisites]);

  // Check if we can deallocate a point from this talent
  const canDeallocate = useCallback((nodeId) => {
    const node = state.nodes.get(nodeId);
    if (!node) return false;

    // Can't deallocate if no points
    if (node.currentRank === 0) return false;

    // Check if any other talents depend on this one being allocated
    const dependents = getDependents(nodeId);
    const hasActiveDependents = dependents.some(depId => {
      const dep = state.nodes.get(depId);
      return dep && dep.currentRank > 0;
    });

    return !hasActiveDependents;
  }, [state, getDependents]);

  // Clear dependent talents recursively
  const clearDependents = useCallback((nodeId, clearedNodes = new Set()) => {
    const cleared = new Map();

    // Avoid infinite loops
    if (clearedNodes.has(nodeId)) return cleared;
    clearedNodes.add(nodeId);

    const dependents = getDependents(nodeId);

    dependents.forEach(depId => {
      const dep = state.nodes.get(depId);
      if (dep && dep.currentRank > 0) {
        // Store the cleared ranks for point refund
        cleared.set(depId, dep.currentRank);

        // Recursively clear dependents of this dependent
        const subCleared = clearDependents(depId, clearedNodes);
        subCleared.forEach((rank, id) => cleared.set(id, rank));
      }
    });

    return cleared;
  }, [state, getDependents]);

  // Toggle rank (allocate/deallocate)
  const toggleRank = useCallback((nodeId) => {
    setState(prevState => {
      const newState = {
        ...prevState,
        nodes: new Map(prevState.nodes)
      };

      const node = newState.nodes.get(nodeId);
      if (!node) return prevState;

      // If has ranks, try to deallocate
      if (node.currentRank > 0) {
        // Check if we can deallocate
        const dependents = getDependents(nodeId);
        const hasActiveDependents = dependents.some(depId => {
          const dep = newState.nodes.get(depId);
          return dep && dep.currentRank > 0;
        });

        if (hasActiveDependents) {
          // Clear all dependents first
          const cleared = clearDependents(nodeId);
          let refundedPoints = 0;

          cleared.forEach((rank, id) => {
            const dep = newState.nodes.get(id);
            if (dep) {
              refundedPoints += rank;
              newState.nodes.set(id, { ...dep, currentRank: 0 });
            }
          });

          // Then deallocate this node
          newState.nodes.set(nodeId, { ...node, currentRank: node.currentRank - 1 });
          newState.totalPoints = prevState.totalPoints - refundedPoints - 1;
        } else {
          // Simple deallocate
          newState.nodes.set(nodeId, { ...node, currentRank: node.currentRank - 1 });
          newState.totalPoints = prevState.totalPoints - 1;
        }
      } else {
        // Try to allocate
        if (newState.totalPoints >= newState.maxPoints) return prevState;
        if (node.currentRank >= node.maxRank) return prevState;
        if (node.locked) return prevState;

        // Check prerequisites
        const prereqsMet = node.prerequisites.every(prereqId => {
          const prereq = newState.nodes.get(prereqId);
          return prereq && prereq.currentRank > 0;
        });

        if (!prereqsMet) return prevState;

        // Allocate point
        newState.nodes.set(nodeId, { ...node, currentRank: node.currentRank + 1 });
        newState.totalPoints = prevState.totalPoints + 1;
      }

      return newState;
    });
  }, [getDependents, clearDependents]);

  // Reset all talents
  const reset = useCallback(() => {
    setState(initializeState());
  }, [initializeState]);

  // Serialize current build to string
  const serialize = useCallback(() => {
    const build = {};

    state.nodes.forEach((node, id) => {
      if (node.currentRank > 0) {
        build[id] = node.currentRank;
      }
    });

    // Simple base64 encoding of JSON
    return btoa(JSON.stringify(build));
  }, [state]);

  // Deserialize build string
  const deserialize = useCallback((buildString) => {
    try {
      // Decode from base64
      const build = JSON.parse(atob(buildString));

      setState(prevState => {
        const newState = {
          ...prevState,
          nodes: new Map(prevState.nodes),
          totalPoints: 0
        };

        // Reset all ranks first
        newState.nodes.forEach((node, id) => {
          newState.nodes.set(id, { ...node, currentRank: 0 });
        });

        // Apply build
        let totalPoints = 0;

        // Sort by dependencies to ensure prerequisites are allocated first
        const sortedIds = Object.keys(build).sort((a, b) => {
          const nodeA = newState.nodes.get(a);
          const nodeB = newState.nodes.get(b);

          if (!nodeA || !nodeB) return 0;

          // If B depends on A, A should come first
          if (nodeB.prerequisites.includes(a)) return -1;
          // If A depends on B, B should come first
          if (nodeA.prerequisites.includes(b)) return 1;

          return 0;
        });

        sortedIds.forEach(id => {
          const node = newState.nodes.get(id);
          const rank = build[id];

          if (node && rank > 0 && rank <= node.maxRank) {
            // Check prerequisites
            const prereqsMet = node.prerequisites.every(prereqId => {
              const prereq = newState.nodes.get(prereqId);
              return prereq && prereq.currentRank > 0;
            });

            if (prereqsMet && !node.locked) {
              newState.nodes.set(id, { ...node, currentRank: rank });
              totalPoints += rank;
            }
          }
        });

        newState.totalPoints = totalPoints;
        return newState;
      });
    } catch (error) {
      console.error('Failed to deserialize build:', error);
    }
  }, []);

  return {
    state,
    toggleRank,
    reset,
    serialize,
    deserialize,
    canAllocate,
    canDeallocate,
    getDependents
  };
};