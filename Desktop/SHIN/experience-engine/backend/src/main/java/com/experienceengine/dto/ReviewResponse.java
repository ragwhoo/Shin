package com.experienceengine.dto;

import java.util.List;

public class ReviewResponse {
    private String task;
    private List<String> concepts;
    private List<String> lessons;
    private List<String> warnings;
    private List<String> recommendations;
    private String confidence;
    private List<String> evidence;

    public ReviewResponse() {}

    public ReviewResponse(String task, List<String> concepts, List<String> lessons,
                          List<String> warnings, List<String> recommendations,
                          String confidence, List<String> evidence) {
        this.task = task;
        this.concepts = concepts;
        this.lessons = lessons;
        this.warnings = warnings;
        this.recommendations = recommendations;
        this.confidence = confidence;
        this.evidence = evidence;
    }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    public List<String> getConcepts() { return concepts; }
    public void setConcepts(List<String> concepts) { this.concepts = concepts; }
    public List<String> getLessons() { return lessons; }
    public void setLessons(List<String> lessons) { this.lessons = lessons; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }
    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }
}
