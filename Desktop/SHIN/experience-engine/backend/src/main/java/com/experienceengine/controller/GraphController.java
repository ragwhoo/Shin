package com.experienceengine.controller;

import com.experienceengine.dto.GraphResponse;
import com.experienceengine.model.Graph;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class GraphController {

    private final Graph graph;

    public GraphController(Graph graph) {
        this.graph = graph;
    }

    @GetMapping("/graph")
    public ResponseEntity<GraphResponse> getGraph() {
        List<Map<String, Object>> nodes = graph.getAllNodes().stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", n.getId());
            m.put("label", n.getTitle());
            m.put("type", n.getType().name().toLowerCase());
            m.put("confidence", n.getConfidence());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> edges = graph.getAllEdges().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", e.getSourceId() + "-" + e.getTargetId());
            m.put("source", e.getSourceId());
            m.put("target", e.getTargetId());
            m.put("label", e.getType().name().toLowerCase());
            m.put("weight", e.getWeight());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new GraphResponse(nodes, edges));
    }
}
