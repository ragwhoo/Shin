package com.experienceengine.dto;

import java.util.List;
import java.util.Map;

public class GraphResponse {
    private List<Map<String, Object>> nodes;
    private List<Map<String, Object>> edges;

    public GraphResponse() {}

    public GraphResponse(List<Map<String, Object>> nodes, List<Map<String, Object>> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<Map<String, Object>> getNodes() { return nodes; }
    public void setNodes(List<Map<String, Object>> nodes) { this.nodes = nodes; }
    public List<Map<String, Object>> getEdges() { return edges; }
    public void setEdges(List<Map<String, Object>> edges) { this.edges = edges; }
}
