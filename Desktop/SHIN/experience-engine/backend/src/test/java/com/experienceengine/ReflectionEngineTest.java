package com.experienceengine;

import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.*;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ReflectionEngineTest {

    private ReflectionEngine engine;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0,
                Map.of("synonyms", List.of("auth", "login"))));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt", "security"), 0.95, 7,
                Map.of("problem", "403 on public routes", "root_cause", "Filter validating all paths")));
        g.addNode(new GraphNode("princ-public", "Public Routes Bypass Auth", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));

        var store = new InMemoryGraphStore(g);
        engine = new ReflectionEngine(
                new ConceptResolver(store),
                new GraphTraverser(store),
                new EvidenceAssembler(store),
                new ReflectionSynthesizer());
    }

    @Test
    void shouldReturnJudgmentPackage() {
        var response = engine.review(new ReviewRequest("Implement JWT Authentication"));
        assertNotNull(response);
        assertFalse(response.getConcepts().isEmpty());
        assertFalse(response.getLessons().isEmpty());
        assertNotNull(response.getConfidence());
    }

    @Test
    void shouldHandleUnknownTask() {
        var response = engine.review(new ReviewRequest("xyzzy unknown task"));
        assertNotNull(response);
        assertEquals("low", response.getConfidence());
    }
}
