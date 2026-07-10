package com.experienceengine.service;

import com.experienceengine.dto.analytics.*;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
    private static final String ANALYTICS_DIR = "analytics";
    private static final String USAGE_FILE = "daily-usage.yml";

    private final GraphStore graphStore;
    private final String brainPath;

    private long totalTasksReviewed = 0;
    private long totalRecommendationsAdopted = 0;
    private long totalMistakesPrevented = 0;
    private long totalEstimatedMinutes = 0;
    private long failedReviews = 0;

    public AnalyticsService(GraphStore graphStore,
                            com.experienceengine.config.BrainPathConfig config) {
        this.graphStore = graphStore;
        this.brainPath = config.getBrainPath();
    }

    public synchronized void recordReview(String task, List<String> concepts,
                                           List<String> adopted, boolean mistakePrevented,
                                           int minutesSaved, String confidence) {
        totalTasksReviewed++;
        if (adopted != null) totalRecommendationsAdopted += adopted.size();
        if (mistakePrevented) totalMistakesPrevented++;
        totalEstimatedMinutes += minutesSaved;

        UsageEntry entry = new UsageEntry(task, true,
                concepts != null ? concepts : List.of(),
                adopted != null ? adopted : List.of(),
                mistakePrevented, minutesSaved, confidence);

        appendDailyEntry(entry);

        String now = LocalDate.now().toString();
        log.info("Analytics: task='{}' concepts={} adopted={} saved={}min confidence={}",
                task, concepts, adopted, minutesSaved, confidence);
    }

    public synchronized void recordFailedReview() {
        failedReviews++;
    }

    public synchronized void recordLearn(String type, String title) {
        log.info("Analytics: learned type={} title='{}'", type, title);
    }

    public OverviewResponse getOverview() {
        OverviewResponse r = new OverviewResponse();
        r.setTasksReviewed(totalTasksReviewed);
        r.setRecommendationsAdopted(totalRecommendationsAdopted);
        r.setMistakesPrevented(totalMistakesPrevented);
        r.setEstimatedHoursSaved(Math.round(totalEstimatedMinutes / 60.0 * 10.0) / 10.0);
        r.setTotalMemories(graphStore.getAllNodes().size());
        long total = totalTasksReviewed + failedReviews;
        r.setReviewSuccessRate(total > 0 ? (double) totalTasksReviewed / total : 0.0);
        return r;
    }

    public ExplorerResponse getExplorer() {
        List<GraphNode> allNodes = new ArrayList<>(graphStore.getAllNodes());

        List<Map<String, Object>> topConcepts = allNodes.stream()
                .filter(n -> n.getType() == NodeType.CONCEPT)
                .sorted(Comparator.comparingInt(GraphNode::getUsageCount).reversed())
                .limit(10)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("concept", n.getTitle());
                    m.put("count", n.getUsageCount());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> topExperiences = allNodes.stream()
                .filter(n -> n.getType() == NodeType.EXPERIENCE)
                .sorted(Comparator.comparingInt(GraphNode::getUsageCount).reversed())
                .limit(10)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", n.getId());
                    m.put("title", n.getTitle());
                    m.put("count", n.getUsageCount());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> mostUsedMemories = allNodes.stream()
                .sorted(Comparator.comparingInt(GraphNode::getUsageCount).reversed())
                .limit(20)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", n.getId());
                    m.put("title", n.getTitle());
                    m.put("type", n.getType().name().toLowerCase());
                    m.put("usageCount", n.getUsageCount());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentlyLearned = allNodes.stream()
                .filter(n -> n.getCreatedAt() != null)
                .sorted(Comparator.comparing(GraphNode::getCreatedAt).reversed())
                .limit(20)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", n.getId());
                    m.put("title", n.getTitle());
                    m.put("type", n.getType().name().toLowerCase());
                    m.put("createdAt", n.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());

        return new ExplorerResponse(topConcepts, topExperiences, mostUsedMemories, recentlyLearned);
    }

    public HealthResponse getHealth() {
        List<GraphNode> allNodes = new ArrayList<>(graphStore.getAllNodes());
        String thirtyDaysAgo = LocalDate.now().minusDays(30).toString();

        long totalConcepts = allNodes.stream().filter(n -> n.getType() == NodeType.CONCEPT).count();
        long totalExperiences = allNodes.stream().filter(n -> n.getType() == NodeType.EXPERIENCE).count();
        long totalPrinciples = allNodes.stream().filter(n -> n.getType() == NodeType.PRINCIPLE).count();
        long totalFailures = allNodes.stream().filter(n -> n.getType() == NodeType.FAILURE).count();
        long totalArchitectures = allNodes.stream().filter(n -> n.getType() == NodeType.ARCHITECTURE).count();

        long unusedMemories = allNodes.stream()
                .filter(n -> n.getUsageCount() == 0
                        && (n.getCreatedAt() == null || n.getCreatedAt().compareTo(thirtyDaysAgo) <= 0))
                .count();

        List<Map<String, Object>> duplicateCandidates = findDuplicateCandidates(allNodes);

        List<Map<String, Object>> topConcepts = allNodes.stream()
                .filter(n -> n.getType() == NodeType.CONCEPT)
                .sorted(Comparator.comparingInt(GraphNode::getUsageCount).reversed())
                .limit(10)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("concept", n.getTitle());
                    m.put("count", n.getUsageCount());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentlyLearned = allNodes.stream()
                .filter(n -> n.getCreatedAt() != null)
                .sorted(Comparator.comparing(GraphNode::getCreatedAt).reversed())
                .limit(20)
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", n.getId());
                    m.put("title", n.getTitle());
                    m.put("type", n.getType().name().toLowerCase());
                    m.put("createdAt", n.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());

        long total = totalTasksReviewed + failedReviews;
        double reviewSuccessRate = total > 0 ? (double) totalTasksReviewed / total : 0.0;

        HealthResponse r = new HealthResponse();
        r.setTotalConcepts(totalConcepts);
        r.setTotalExperiences(totalExperiences);
        r.setTotalPrinciples(totalPrinciples);
        r.setTotalFailures(totalFailures);
        r.setTotalArchitectures(totalArchitectures);
        r.setUnusedMemories(unusedMemories);
        r.setDuplicateCandidates(duplicateCandidates.size());
        r.setReviewSuccessRate(Math.round(reviewSuccessRate * 100.0) / 100.0);
        r.setTopConcepts(topConcepts);
        r.setRecentlyLearned(recentlyLearned);
        return r;
    }

    private List<Map<String, Object>> findDuplicateCandidates(List<GraphNode> nodes) {
        List<Map<String, Object>> candidates = new ArrayList<>();
        List<GraphNode> sorted = new ArrayList<>(nodes);
        for (int i = 0; i < sorted.size(); i++) {
            for (int j = i + 1; j < sorted.size(); j++) {
                GraphNode a = sorted.get(i);
                GraphNode b = sorted.get(j);
                if (a.getType() != b.getType()) continue;
                if (a.getId().equals(b.getId())) continue;
                double score = 0;
                if (a.getTitle() != null && b.getTitle() != null
                        && similarTitle(a.getTitle(), b.getTitle())) score += 0.5;
                if (hasSharedTags(a, b)) score += 0.3;
                if (hasSharedConcept(a, b)) score += 0.2;
                if (score >= 0.5) {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("a", a.getId());
                    m.put("b", b.getId());
                    m.put("titleA", a.getTitle());
                    m.put("titleB", b.getTitle());
                    m.put("score", Math.round(score * 100.0) / 100.0);
                    candidates.add(m);
                }
            }
        }
        return candidates;
    }

    private boolean similarTitle(String a, String b) {
        String na = a.toLowerCase().replaceAll("[^a-z0-9 ]", "");
        String nb = b.toLowerCase().replaceAll("[^a-z0-9 ]", "");
        if (na.equals(nb)) return true;
        if (na.contains(nb) || nb.contains(na)) return true;
        String[] wa = na.split(" ");
        String[] wb = nb.split(" ");
        long shared = Arrays.stream(wa).filter(w -> w.length() > 3 && Arrays.asList(wb).contains(w)).count();
        return shared >= Math.min(wa.length, wb.length) * 0.5;
    }

    private boolean hasSharedTags(GraphNode a, GraphNode b) {
        if (a.getTags() == null || b.getTags() == null) return false;
        return a.getTags().stream().anyMatch(t -> b.getTags().stream().anyMatch(t::equalsIgnoreCase));
    }

    private boolean hasSharedConcept(GraphNode a, GraphNode b) {
        if (a.getType() == NodeType.CONCEPT || b.getType() == NodeType.CONCEPT) return false;
        List<String> conceptsA = extractConceptIds(a);
        List<String> conceptsB = extractConceptIds(b);
        return conceptsA.stream().anyMatch(conceptsB::contains);
    }

    private List<String> extractConceptIds(GraphNode node) {
        Map<String, Object> p = node.getPayload();
        if (p == null) return List.of();
        Object concept = p.get("concept");
        if (concept instanceof String) return List.of((String) concept);
        if (concept instanceof List) return ((List<?>) concept).stream()
                .map(Object::toString).collect(Collectors.toList());
        return List.of();
    }

    private void appendDailyEntry(UsageEntry entry) {
        Path analyticsDir = Paths.get(brainPath, ANALYTICS_DIR);
        Path file = analyticsDir.resolve(USAGE_FILE);
        try {
            Files.createDirectories(analyticsDir);
            String line = String.format(
                "  - task: %s\n    review_used: %b\n    concepts: %s\n    recommendations_adopted: %s\n    mistake_prevented: %b\n    estimated_time_saved_minutes: %d\n    confidence: %s\n",
                sanitizeYaml(entry.getTask()),
                entry.isReviewUsed(),
                yamlList(entry.getConcepts()),
                yamlList(entry.getRecommendationsAdopted()),
                entry.isMistakePrevented(),
                entry.getEstimatedTimeSavedMinutes(),
                entry.getConfidence() != null ? entry.getConfidence() : "unknown"
            );
            String header = !Files.exists(file) || Files.size(file) == 0
                    ? "date: " + LocalDate.now() + "\nentries:\n"
                    : "";
            Files.writeString(file, header + line,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            log.warn("Failed to write daily usage log: {}", e.getMessage());
        }
    }

    private String sanitizeYaml(String s) {
        if (s == null) return "";
        return s.replace("'", "''").replace("\n", " ").replace("\r", " ");
    }

    private String yamlList(List<String> items) {
        if (items == null || items.isEmpty()) return "[]";
        return items.stream()
                .map(i -> sanitizeYaml(i))
                .collect(Collectors.joining(", ", "[", "]"));
    }
}
