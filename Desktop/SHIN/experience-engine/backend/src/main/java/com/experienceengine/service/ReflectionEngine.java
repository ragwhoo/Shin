package com.experienceengine.service;

import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReflectionEngine {

    private final ConceptResolver conceptResolver;
    private final GraphTraverser graphTraverser;
    private final EvidenceAssembler evidenceAssembler;
    private final ReflectionSynthesizer reflectionSynthesizer;
    private final AnalyticsService analyticsService;
    private final GraphStore graphStore;

    public ReflectionEngine(ConceptResolver conceptResolver, GraphTraverser graphTraverser,
                            EvidenceAssembler evidenceAssembler,
                            ReflectionSynthesizer reflectionSynthesizer,
                            AnalyticsService analyticsService,
                            GraphStore graphStore) {
        this.conceptResolver = conceptResolver;
        this.graphTraverser = graphTraverser;
        this.evidenceAssembler = evidenceAssembler;
        this.reflectionSynthesizer = reflectionSynthesizer;
        this.analyticsService = analyticsService;
        this.graphStore = graphStore;
    }

    public ReviewResponse review(ReviewRequest request) {
        var concepts = conceptResolver.resolve(request.getTask());
        var conceptIds = concepts.stream().map(c -> c.id).collect(Collectors.toList());
        var conceptNames = concepts.stream().map(c -> c.name).collect(Collectors.toList());

        if (conceptIds.isEmpty()) {
            analyticsService.recordReview(request.getTask(), List.of(), List.of(), false, 0, "low");
            return new ReviewResponse(request.getTask(), List.of(), List.of(), List.of(),
                    List.of(), "low", List.of());
        }

        var traversal = graphTraverser.traverse(conceptIds, 3);
        var evidence = evidenceAssembler.assemble(traversal, concepts, 3);
        var synthesis = reflectionSynthesizer.synthesize(evidence);

        graphStore.recordUsage(conceptIds);
        graphStore.recordUsage(synthesis.evidenceIds());

        int estimatedMinutes = Math.max(10, synthesis.lessons().size() * 15);
        analyticsService.recordReview(request.getTask(), conceptNames, List.of(),
                !synthesis.warnings().isEmpty(), estimatedMinutes, synthesis.confidence());

        return new ReviewResponse(request.getTask(), conceptNames,
                synthesis.lessons(), synthesis.warnings(), synthesis.recommendations(),
                synthesis.confidence(), synthesis.evidenceIds());
    }
}
