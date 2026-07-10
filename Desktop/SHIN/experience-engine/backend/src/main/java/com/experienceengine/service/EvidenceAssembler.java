package com.experienceengine.service;

import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EvidenceAssembler {

    private final GraphStore graphStore;

    public EvidenceAssembler(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public EvidenceResult assemble(GraphTraverser.TraversalResult traversal,
                                   List<ConceptResolver.ResolvedConcept> concepts,
                                   int maxDepth) {
        List<ScoredNode> all = new ArrayList<>();

        for (String id : traversal.experienceIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.principleIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.decisionIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.failureIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.architectureIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }

        all.sort((a, b) -> Double.compare(b.totalScore, a.totalScore));

        List<GraphNode> experiences = new ArrayList<>();
        List<GraphNode> principles = new ArrayList<>();
        List<GraphNode> decisions = new ArrayList<>();
        List<GraphNode> failures = new ArrayList<>();
        List<GraphNode> architectures = new ArrayList<>();

        for (ScoredNode sn : all) {
            GraphNode node = graphStore.getNode(sn.id).orElse(null);
            if (node == null) continue;
            switch (node.getType()) {
                case EXPERIENCE -> experiences.add(node);
                case PRINCIPLE -> principles.add(node);
                case DECISION -> decisions.add(node);
                case FAILURE -> failures.add(node);
                case ARCHITECTURE -> architectures.add(node);
            }
        }

        return new EvidenceResult(experiences, principles, decisions, failures, architectures);
    }

    private void scoreAndAdd(List<ScoredNode> all, String id,
                             GraphTraverser.TraversalResult traversal,
                             List<ConceptResolver.ResolvedConcept> concepts,
                             int maxDepth) {
        GraphNode node = graphStore.getNode(id).orElse(null);
        if (node == null) return;

        int depth = traversal.depths.getOrDefault(id, maxDepth);

        double conceptScore = 0;
        for (var rc : concepts) {
            for (GraphEdge edge : graphStore.getEdges(rc.id)) {
                if (edge.getSourceId().equals(id) || edge.getTargetId().equals(id)) {
                    conceptScore = Math.max(conceptScore, edge.getWeight());
                }
            }
        }
        if (concepts.stream().anyMatch(c -> c.id.equals(id))) {
            conceptScore = 1.0;
        }

        double distanceScore = 1.0 - ((double) depth / maxDepth);
        double confidenceScore = node.getConfidence();
        double usageScore = Math.min(node.getUsageCount() / 10.0, 1.0);

        double total = conceptScore * 0.4 + distanceScore * 0.3 + confidenceScore * 0.2 + usageScore * 0.1;
        all.add(new ScoredNode(id, total));
    }

    private record ScoredNode(String id, double totalScore) {}

    public record EvidenceResult(List<GraphNode> experiences, List<GraphNode> principles,
                                  List<GraphNode> decisions, List<GraphNode> failures,
                                  List<GraphNode> architectures) {
        public boolean isEmpty() {
            return experiences.isEmpty() && principles.isEmpty() && decisions.isEmpty()
                    && failures.isEmpty() && architectures.isEmpty();
        }
        public int totalCount() {
            return experiences.size() + principles.size() + decisions.size()
                    + failures.size() + architectures.size();
        }
    }
}
