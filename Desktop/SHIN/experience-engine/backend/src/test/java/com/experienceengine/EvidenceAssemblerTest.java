package com.experienceengine;

import com.experienceengine.model.*;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.*;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class EvidenceAssemblerTest {

    private EvidenceAssembler assembler;
    private GraphTraverser.TraversalResult traversal;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0, Map.of()));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt"), 0.95, 7, Map.of()));
        g.addNode(new GraphNode("princ-public", "Public Routes", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));

        var store = new InMemoryGraphStore(g);
        assembler = new EvidenceAssembler(store);
        var traverser = new GraphTraverser(store);
        traversal = traverser.traverse(List.of("c-auth"), 2);
    }

    @Test
    void shouldAssembleAndRankEvidence() {
        var concepts = List.of(new ConceptResolver.ResolvedConcept("c-auth", "Authentication", 1.0));
        var result = assembler.assemble(traversal, concepts, 2);
        assertFalse(result.experiences().isEmpty());
        assertFalse(result.principles().isEmpty());
    }
}
