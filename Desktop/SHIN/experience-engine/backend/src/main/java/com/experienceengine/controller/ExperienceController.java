package com.experienceengine.controller;

import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ExperienceController {

    private final GraphStore graphStore;

    public ExperienceController(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<GraphNode>> getExperiences() {
        return ResponseEntity.ok(graphStore.getNodesByType(NodeType.EXPERIENCE));
    }
}
