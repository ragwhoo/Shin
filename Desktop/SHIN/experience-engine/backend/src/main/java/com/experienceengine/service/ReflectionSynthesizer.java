package com.experienceengine.service;

import com.experienceengine.model.GraphNode;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReflectionSynthesizer {

    public SynthesisResult synthesize(EvidenceAssembler.EvidenceResult evidence) {
        List<String> lessons = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        List<String> evidenceIds = new ArrayList<>();

        for (GraphNode n : evidence.principles()) {
            lessons.add(n.getTitle());
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.experiences()) {
            Map<String, Object> p = n.getPayload();
            if (p.containsKey("root_cause")) {
                lessons.add("Avoid: " + p.get("root_cause"));
            }
            if (n.getTags() != null && n.getTags().stream().anyMatch(t ->
                    t.equalsIgnoreCase("security") || t.equalsIgnoreCase("payment"))) {
                warnings.add(n.getTitle() + " — review for security/payment implications");
            }
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.failures()) {
            Map<String, Object> p = n.getPayload();
            warnings.add(n.getTitle() + ": " + p.getOrDefault("lesson", ""));
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.architectures()) {
            recommendations.add("Reuse architecture: " + n.getTitle());
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.decisions()) {
            recommendations.add("Consider: " + n.getTitle());
            evidenceIds.add(n.getId());
        }

        double avg = calcConfidence(evidence);
        return new SynthesisResult(dedup(lessons), dedup(warnings), dedup(recommendations),
                label(avg), evidenceIds);
    }

    private double calcConfidence(EvidenceAssembler.EvidenceResult e) {
        int count = e.totalCount();
        if (count == 0) return 0;
        double sum = 0;
        for (var list : List.of(e.experiences(), e.principles(), e.decisions(),
                e.failures(), e.architectures())) {
            for (var n : list) sum += n.getConfidence();
        }
        return sum / count;
    }

    private String label(double avg) {
        return avg >= 0.8 ? "high" : avg >= 0.5 ? "medium" : "low";
    }

    private List<String> dedup(List<String> items) {
        return items.stream().distinct().collect(Collectors.toList());
    }

    public record SynthesisResult(List<String> lessons, List<String> warnings,
                                   List<String> recommendations, String confidence,
                                   List<String> evidenceIds) {}
}
