package com.experienceengine.model;

import java.util.*;

public class Graph {
    private Map<String, GraphNode> nodes = new HashMap<>();
    private List<GraphEdge> edges = new ArrayList<>();
    private Map<String, List<GraphEdge>> adjacency = new HashMap<>();

    public void addNode(GraphNode node) { nodes.put(node.getId(), node); }
    public void addEdge(GraphEdge edge) {
        edges.add(edge);
        adjacency.computeIfAbsent(edge.getSourceId(), k -> new ArrayList<>()).add(edge);
        adjacency.computeIfAbsent(edge.getTargetId(), k -> new ArrayList<>()).add(edge);
    }
    public GraphNode getNode(String id) { return nodes.get(id); }
    public Collection<GraphNode> getAllNodes() { return nodes.values(); }
    public List<GraphEdge> getAllEdges() { return edges; }
    public List<GraphEdge> getEdges(String nodeId) { return adjacency.getOrDefault(nodeId, List.of()); }
    public boolean containsNode(String id) { return nodes.containsKey(id); }
}
