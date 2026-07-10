package com.experienceengine.store;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class InMemoryGraphStore implements GraphStore {

    private final Graph graph;

    public InMemoryGraphStore(Graph graph) {
        this.graph = graph;
    }

    @Override
    public Graph getGraph() { return graph; }

    @Override
    public Collection<GraphNode> getAllNodes() { return graph.getAllNodes(); }

    @Override
    public List<GraphNode> getNodesByType(NodeType type) {
        return graph.getAllNodes().stream()
                .filter(n -> n.getType() == type)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<GraphNode> getNode(String id) {
        return Optional.ofNullable(graph.getNode(id));
    }

    @Override
    public List<GraphEdge> getEdges(String nodeId) {
        return graph.getEdges(nodeId);
    }

    @Override
    public List<GraphNode> findNodesByText(String query) {
        String lower = query.toLowerCase();
        return graph.getAllNodes().stream()
                .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(lower))
                        || (n.getId() != null && n.getId().toLowerCase().contains(lower)))
                .collect(Collectors.toList());
    }

    @Override
    public List<GraphNode> findNodesByTag(String tag) {
        return graph.getAllNodes().stream()
                .filter(n -> n.getTags() != null && n.getTags().stream()
                        .anyMatch(t -> t.equalsIgnoreCase(tag)))
                .collect(Collectors.toList());
    }

    @Override
    public void recordUsage(List<String> nodeIds) {
        String now = java.time.LocalDate.now().toString();
        for (String id : nodeIds) {
            GraphNode node = graph.getNode(id);
            if (node != null) {
                node.setUsageCount(node.getUsageCount() + 1);
                node.setLastUsed(now);
            }
        }
    }

    @Override
    public void addNode(GraphNode node) {
        graph.addNode(node);
    }

    @Override
    public void recordAdoption(List<String> nodeIds) {
        String now = java.time.LocalDate.now().toString();
        for (String id : nodeIds) {
            GraphNode node = graph.getNode(id);
            if (node != null) {
                node.setLastVerified(now);
            }
        }
    }
}
