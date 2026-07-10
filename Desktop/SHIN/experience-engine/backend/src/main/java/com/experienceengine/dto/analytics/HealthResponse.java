package com.experienceengine.dto.analytics;

import java.util.List;
import java.util.Map;

public class HealthResponse {
    private long totalConcepts;
    private long totalExperiences;
    private long totalPrinciples;
    private long totalFailures;
    private long totalArchitectures;
    private long unusedMemories;
    private long duplicateCandidates;
    private double reviewSuccessRate;
    private List<Map<String, Object>> topConcepts;
    private List<Map<String, Object>> recentlyLearned;

    public HealthResponse() {}

    public long getTotalConcepts() { return totalConcepts; }
    public void setTotalConcepts(long totalConcepts) { this.totalConcepts = totalConcepts; }
    public long getTotalExperiences() { return totalExperiences; }
    public void setTotalExperiences(long totalExperiences) { this.totalExperiences = totalExperiences; }
    public long getTotalPrinciples() { return totalPrinciples; }
    public void setTotalPrinciples(long totalPrinciples) { this.totalPrinciples = totalPrinciples; }
    public long getTotalFailures() { return totalFailures; }
    public void setTotalFailures(long totalFailures) { this.totalFailures = totalFailures; }
    public long getTotalArchitectures() { return totalArchitectures; }
    public void setTotalArchitectures(long totalArchitectures) { this.totalArchitectures = totalArchitectures; }
    public long getUnusedMemories() { return unusedMemories; }
    public void setUnusedMemories(long unusedMemories) { this.unusedMemories = unusedMemories; }
    public long getDuplicateCandidates() { return duplicateCandidates; }
    public void setDuplicateCandidates(long duplicateCandidates) { this.duplicateCandidates = duplicateCandidates; }
    public double getReviewSuccessRate() { return reviewSuccessRate; }
    public void setReviewSuccessRate(double reviewSuccessRate) { this.reviewSuccessRate = reviewSuccessRate; }
    public List<Map<String, Object>> getTopConcepts() { return topConcepts; }
    public void setTopConcepts(List<Map<String, Object>> topConcepts) { this.topConcepts = topConcepts; }
    public List<Map<String, Object>> getRecentlyLearned() { return recentlyLearned; }
    public void setRecentlyLearned(List<Map<String, Object>> recentlyLearned) { this.recentlyLearned = recentlyLearned; }
}
