package com.experienceengine.model;

import com.experienceengine.model.enums.NodeType;
import java.util.List;
import java.util.Map;

public class GraphNode {
    private String id;
    private String title;
    private NodeType type;
    private List<String> tags;
    private double confidence;
    private int usageCount;
    private String createdAt;
    private String lastUsed;
    private String lastVerified;
    private Map<String, Object> payload;

    public GraphNode() {}

    public GraphNode(String id, String title, NodeType type, List<String> tags,
                     double confidence, int usageCount, String createdAt,
                     String lastUsed, String lastVerified, Map<String, Object> payload) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.tags = tags;
        this.confidence = confidence;
        this.usageCount = usageCount;
        this.createdAt = createdAt;
        this.lastUsed = lastUsed;
        this.lastVerified = lastVerified;
        this.payload = payload;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public NodeType getType() { return type; }
    public void setType(NodeType type) { this.type = type; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getLastUsed() { return lastUsed; }
    public void setLastUsed(String lastUsed) { this.lastUsed = lastUsed; }
    public String getLastVerified() { return lastVerified; }
    public void setLastVerified(String lastVerified) { this.lastVerified = lastVerified; }
    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }
}
