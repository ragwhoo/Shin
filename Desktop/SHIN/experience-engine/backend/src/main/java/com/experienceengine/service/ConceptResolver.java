package com.experienceengine.service;

import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConceptResolver {

    private final GraphStore graphStore;

    public ConceptResolver(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public List<ResolvedConcept> resolve(String task) {
        String lower = task.toLowerCase();
        List<GraphNode> concepts = graphStore.getNodesByType(NodeType.CONCEPT);
        List<ResolvedConcept> results = new ArrayList<>();

        for (GraphNode concept : concepts) {
            double score = score(concept, lower);
            if (score > 0) {
                results.add(new ResolvedConcept(concept.getId(), concept.getTitle(), score));
            }
        }

        results.sort((a, b) -> Double.compare(b.score, a.score));
        return results;
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "is", "it", "as", "be", "was", "are",
            "been", "being", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "can", "shall", "this",
            "that", "these", "those", "not", "no", "nor", "so", "if", "then",
            "than", "too", "very", "just", "about", "above", "after", "again",
            "all", "also", "am", "any", "because", "before", "between", "both",
            "each", "few", "more", "most", "other", "own", "same", "some",
            "such", "only", "into", "over", "under", "up", "down", "out", "off",
            "here", "there", "when", "where", "why", "how", "what", "which",
            "who", "whom", "its", "my", "your", "his", "her", "our", "their",
            "across", "through", "during", "using", "implement", "build", "add",
            "create", "design", "handle", "fix", "secure", "deploy", "choose",
            "integrate", "perform", "introduce", "refactor"
    );

    @SuppressWarnings("unchecked")
    private double score(GraphNode concept, String taskLower) {
        double score = 0.0;
        String title = concept.getTitle();
        if (title != null) {
            String t = title.toLowerCase();
            if (taskLower.contains(t)) { score += 1.0; }
            for (String word : taskLower.split("[\\s\\-]+")) {
                if (word.length() < 4 || STOP_WORDS.contains(word)) continue;
                if (t.contains(word)) { score += 0.5; }
            }
        }
        List<String> synonyms = (List<String>) concept.getPayload().getOrDefault("synonyms", List.of());
        for (String syn : synonyms) {
            if (syn.length() < 3) continue;
            if (taskLower.contains(syn.toLowerCase())) { score += 0.4; }
        }
        if (concept.getTags() != null) {
            for (String tag : concept.getTags()) {
                if (tag.length() < 3) continue;
                if (taskLower.contains(tag.toLowerCase())) { score += 0.3; }
            }
        }
        return Math.min(score, 1.0);
    }

    public static class ResolvedConcept {
        public final String id;
        public final String name;
        public final double score;
        public ResolvedConcept(String id, String name, double score) {
            this.id = id; this.name = name; this.score = score;
        }
    }
}
