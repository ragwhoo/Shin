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
public class ConceptController {

    private final GraphStore graphStore;

    public ConceptController(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    @GetMapping("/concepts")
    public ResponseEntity<List<GraphNode>> getConcepts() {
        return ResponseEntity.ok(graphStore.getNodesByType(NodeType.CONCEPT));
    }
}
