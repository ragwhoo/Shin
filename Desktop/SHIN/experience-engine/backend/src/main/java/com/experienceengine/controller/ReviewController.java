package com.experienceengine.controller;

import com.experienceengine.config.BrainPathConfig;
import com.experienceengine.dto.LearnRequest;
import com.experienceengine.dto.LearnResponse;
import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.service.AnalyticsService;
import com.experienceengine.service.ReflectionEngine;
import com.experienceengine.store.GraphStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReflectionEngine reflectionEngine;
    private final GraphStore graphStore;
    private final AnalyticsService analyticsService;
    private final BrainPathConfig brainPathConfig;

    public ReviewController(ReflectionEngine reflectionEngine,
                            GraphStore graphStore,
                            AnalyticsService analyticsService,
                            BrainPathConfig brainPathConfig) {
        this.reflectionEngine = reflectionEngine;
        this.graphStore = graphStore;
        this.analyticsService = analyticsService;
        this.brainPathConfig = brainPathConfig;
    }

    @PostMapping("/review")
    public ResponseEntity<ReviewResponse> review(@RequestBody ReviewRequest request) {
        if (request.getTask() == null || request.getTask().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reflectionEngine.review(request));
    }

    @PostMapping("/learn")
    public ResponseEntity<LearnResponse> learn(@RequestBody LearnRequest request) {
        if (request.getType() == null || request.getType().isBlank()
                || request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        NodeType nodeType;
        String subDir;
        String prefix;
        switch (request.getType().toLowerCase()) {
            case "experience":
                nodeType = NodeType.EXPERIENCE;
                subDir = "experiences";
                prefix = "exp-";
                break;
            case "principle":
                nodeType = NodeType.PRINCIPLE;
                subDir = "principles";
                prefix = "principle-";
                break;
            case "failure":
                nodeType = NodeType.FAILURE;
                subDir = "failures";
                prefix = "failure-";
                break;
            case "architecture":
                nodeType = NodeType.ARCHITECTURE;
                subDir = "architectures";
                prefix = "arch-";
                break;
            case "decision":
                nodeType = NodeType.DECISION;
                subDir = "decisions";
                prefix = "decision-";
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        String id = prefix + request.getTitle()
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");

        String now = LocalDate.now().toString();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", id);
        payload.put("title", request.getTitle());
        payload.put("tags", request.getTags() != null ? request.getTags() : List.of());
        payload.put("confidence", 0.7);
        payload.put("usage_count", 0);
        payload.put("created_at", now);
        payload.put("last_used", now);
        payload.put("last_verified", now);

        if (request.getContent() != null && !request.getContent().isBlank()) {
            payload.put("content", request.getContent());
        }

        GraphNode node = new GraphNode(id, request.getTitle(), nodeType,
                request.getTags() != null ? request.getTags() : List.of(),
                0.7, 0, now, now, now, payload);

        graphStore.addNode(node);

        try {
            Path dir = Paths.get(brainPathConfig.getBrainPath(), subDir);
            Files.createDirectories(dir);
            Path file = dir.resolve(id + ".yml");
            Yaml yaml = new Yaml();
            yaml.dump(payload, new FileWriter(file.toFile()));
        } catch (IOException e) {
            return ResponseEntity.ok(new LearnResponse("saved", "Saved to memory but failed to persist: " + e.getMessage(), id));
        }

        analyticsService.recordLearn(request.getType(), request.getTitle());

        return ResponseEntity.ok(new LearnResponse("success", "Saved as " + nodeType.name().toLowerCase(), id));
    }
}
