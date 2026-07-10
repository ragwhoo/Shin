package com.experienceengine;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.GraphTraverser;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class GraphTraverserTest {

    private GraphTraverser traverser;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0, Map.of()));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt"), 0.95, 7, Map.of()));
        g.addNode(new GraphNode("princ-public", "Public Routes Bypass", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));
        traverser = new GraphTraverser(new InMemoryGraphStore(g));
    }

    @Test
    void shouldFindConnectedNodes() {
        var result = traverser.traverse(List.of("c-auth"), 2);
        assertFalse(result.experienceIds.isEmpty());
        assertFalse(result.principleIds.isEmpty());
    }

    @Test
    void shouldTrackDepth() {
        var result = traverser.traverse(List.of("c-auth"), 2);
        assertEquals(0, result.depths.get("c-auth").intValue());
        assertEquals(1, result.depths.get("exp-jwt").intValue());
    }
}
