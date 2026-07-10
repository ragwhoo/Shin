package com.experienceengine;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.service.ConceptResolver;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ConceptResolverTest {

    private ConceptResolver resolver;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0,
                Map.of("synonyms", List.of("auth", "login"))));
        g.addNode(new GraphNode("c-jwt", "JWT", NodeType.CONCEPT,
                List.of("jwt", "token"), 0.9, 0,
                Map.of("synonyms", List.of("json-web-token"))));
        g.addNode(new GraphNode("c-payment", "Payment Integration", NodeType.CONCEPT,
                List.of("payments"), 0.8, 0,
                Map.of("synonyms", List.of("checkout"))));
        resolver = new ConceptResolver(new InMemoryGraphStore(g));
    }

    @Test
    void shouldFindMatchingConcepts() {
        var result = resolver.resolve("Implement JWT Authentication");
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(c -> c.name.equals("Authentication")));
        assertTrue(result.stream().anyMatch(c -> c.name.equals("JWT")));
    }

    @Test
    void shouldReturnEmptyForUnrelated() {
        assertTrue(resolver.resolve("Fix CSS layout").isEmpty());
    }

    @Test
    void shouldMatchUsingSynonyms() {
        var result = resolver.resolve("Setup login flow");
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(c -> c.name.equals("Authentication")));
    }
}
