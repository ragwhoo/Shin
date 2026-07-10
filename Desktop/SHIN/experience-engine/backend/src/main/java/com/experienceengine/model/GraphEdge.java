package com.experienceengine.model;

import com.experienceengine.model.enums.RelationType;

public class GraphEdge {
    private String sourceId;
    private String targetId;
    private RelationType type;
    private double weight;

    public GraphEdge() {}

    public GraphEdge(String sourceId, String targetId, RelationType type, double weight) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.type = type;
        this.weight = weight;
    }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public RelationType getType() { return type; }
    public void setType(RelationType type) { this.type = type; }
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}
