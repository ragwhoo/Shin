package com.experienceengine.service;

import com.experienceengine.model.GraphEdge;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GraphTraverser {

    private final GraphStore graphStore;

    public GraphTraverser(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public TraversalResult traverse(List<String> conceptIds, int maxDepth) {
        Set<String> visited = new HashSet<>();
        Set<String> experienceIds = new HashSet<>();
        Set<String> principleIds = new HashSet<>();
        Set<String> decisionIds = new HashSet<>();
        Set<String> failureIds = new HashSet<>();
        Set<String> architectureIds = new HashSet<>();
        Map<String, Integer> depths = new HashMap<>();

        for (String id : conceptIds) {
            bfs(id, maxDepth, visited, depths, experienceIds, principleIds,
                    decisionIds, failureIds, architectureIds);
        }

        return new TraversalResult(experienceIds, principleIds, decisionIds,
                failureIds, architectureIds, depths);
    }

    private void bfs(String start, int maxDepth, Set<String> visited,
                     Map<String, Integer> depths,
                     Set<String> exps, Set<String> prins, Set<String> decis,
                     Set<String> fails, Set<String> archs) {
        Queue<String> queue = new LinkedList<>();
        queue.add(start);
        depths.put(start, 0);
        visited.add(start);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            int d = depths.get(current);

            graphStore.getNode(current).ifPresent(node -> {
                switch (node.getType()) {
                    case EXPERIENCE -> exps.add(node.getId());
                    case PRINCIPLE -> prins.add(node.getId());
                    case DECISION -> decis.add(node.getId());
                    case FAILURE -> fails.add(node.getId());
                    case ARCHITECTURE -> archs.add(node.getId());
                }
            });

            if (d >= maxDepth) continue;

            for (GraphEdge edge : graphStore.getEdges(current)) {
                String neighbor = edge.getSourceId().equals(current)
                        ? edge.getTargetId() : edge.getSourceId();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    depths.put(neighbor, d + 1);
                    queue.add(neighbor);
                }
            }
        }
    }

    public static class TraversalResult {
        public final Set<String> experienceIds;
        public final Set<String> principleIds;
        public final Set<String> decisionIds;
        public final Set<String> failureIds;
        public final Set<String> architectureIds;
        public final Map<String, Integer> depths;

        public TraversalResult(Set<String> experienceIds, Set<String> principleIds,
                               Set<String> decisionIds, Set<String> failureIds,
                               Set<String> architectureIds, Map<String, Integer> depths) {
            this.experienceIds = experienceIds;
            this.principleIds = principleIds;
            this.decisionIds = decisionIds;
            this.failureIds = failureIds;
            this.architectureIds = architectureIds;
            this.depths = depths;
        }
    }
}
