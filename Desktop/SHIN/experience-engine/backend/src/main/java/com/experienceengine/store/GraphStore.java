package com.experienceengine.store;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface GraphStore {
    Graph getGraph();
    Collection<GraphNode> getAllNodes();
    List<GraphNode> getNodesByType(NodeType type);
    Optional<GraphNode> getNode(String id);
    List<GraphEdge> getEdges(String nodeId);
    List<GraphNode> findNodesByText(String query);
    List<GraphNode> findNodesByTag(String tag);
    void recordUsage(List<String> nodeIds);
    void recordAdoption(List<String> nodeIds);
    void addNode(GraphNode node);
}
