package com.experienceengine.loader;

import com.experienceengine.config.BrainPathConfig;
import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Component
public class YamlGraphLoader {

    private static final Logger log = LoggerFactory.getLogger(YamlGraphLoader.class);
    private final BrainPathConfig config;

    public YamlGraphLoader(BrainPathConfig config) {
        this.config = config;
    }

    public Graph loadGraph() {
        Graph graph = new Graph();
        Path brainPath = Paths.get(config.getBrainPath());
        if (!Files.exists(brainPath)) {
            log.warn("Brain path does not exist: {}", brainPath);
            return graph;
        }

        loadNodes(graph, brainPath.resolve("concepts"), NodeType.CONCEPT);
        loadNodes(graph, brainPath.resolve("experiences"), NodeType.EXPERIENCE);
        loadNodes(graph, brainPath.resolve("principles"), NodeType.PRINCIPLE);
        loadNodes(graph, brainPath.resolve("decisions"), NodeType.DECISION);
        loadNodes(graph, brainPath.resolve("failures"), NodeType.FAILURE);
        loadNodes(graph, brainPath.resolve("architectures"), NodeType.ARCHITECTURE);
        loadEdges(graph, brainPath.resolve("graph/relations.yml"));

        log.info("Loaded {} nodes and {} edges", graph.getAllNodes().size(), graph.getAllEdges().size());
        return graph;
    }

    private void loadNodes(Graph graph, Path dir, NodeType type) {
        if (!Files.exists(dir)) return;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.yml")) {
            for (Path file : stream) {
                Map<String, Object> data = readYaml(file);
                if (data == null) continue;
                String id = (String) data.get("id");
                String title = (String) data.get("title");
                if (id == null || title == null) {
                    log.warn("Skipping {}: missing id or title", file);
                    continue;
                }
                @SuppressWarnings("unchecked")
                List<Object> rawTags = (List<Object>) data.getOrDefault("tags", List.of());
                List<String> tags = rawTags.stream()
                        .map(Object::toString)
                        .toList();
                Number conf = (Number) data.getOrDefault("confidence", 0.5);
                Number usage = (Number) data.getOrDefault("usage_count", 0);
                String createdAt = (String) data.getOrDefault("created_at", null);
                String lastUsed = (String) data.getOrDefault("last_used", null);
                String lastVerified = (String) data.getOrDefault("last_verified", null);
                Map<String, Object> payload = new LinkedHashMap<>(data);
                payload.remove("id");
                payload.remove("title");
                payload.remove("tags");
                payload.remove("confidence");
                payload.remove("usage_count");
                payload.remove("created_at");
                payload.remove("last_used");
                payload.remove("last_verified");

                GraphNode node = new GraphNode(id, title, type, tags,
                        conf.doubleValue(), usage.intValue(), createdAt,
                        lastUsed, lastVerified, payload);
                graph.addNode(node);
            }
        } catch (IOException e) {
            log.error("Error loading {}: {}", dir, e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private void loadEdges(Graph graph, Path file) {
        if (!Files.exists(file)) return;
        Map<String, Object> data = readYaml(file);
        if (data == null) return;
        List<Map<String, Object>> rels = (List<Map<String, Object>>) data.get("relations");
        if (rels == null) return;
        for (Map<String, Object> r : rels) {
            String sourceId = (String) r.get("source");
            String targetId = (String) r.get("target");
            String typeStr = (String) r.get("type");
            Number weight = (Number) r.getOrDefault("weight", 0.5);
            if (sourceId == null || targetId == null || typeStr == null) continue;
            try {
                RelationType rt = RelationType.valueOf(typeStr);
                if (graph.containsNode(sourceId) && graph.containsNode(targetId)) {
                    graph.addEdge(new GraphEdge(sourceId, targetId, rt, weight.doubleValue()));
                }
            } catch (IllegalArgumentException e) {
                log.warn("Unknown relation type: {}", typeStr);
            }
        }
    }

    private Map<String, Object> readYaml(Path file) {
        try {
            Yaml yaml = new Yaml();
            try (InputStream is = Files.newInputStream(file)) {
                return yaml.load(is);
            }
        } catch (IOException e) {
            log.error("Error reading {}: {}", file, e.getMessage());
            return null;
        }
    }
}
