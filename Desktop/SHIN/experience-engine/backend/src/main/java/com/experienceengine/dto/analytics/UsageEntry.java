package com.experienceengine.dto.analytics;

import java.util.List;

public class UsageEntry {
    private String task;
    private boolean reviewUsed;
    private List<String> concepts;
    private List<String> recommendationsAdopted;
    private boolean mistakePrevented;
    private int estimatedTimeSavedMinutes;
    private String confidence;

    public UsageEntry() {}

    public UsageEntry(String task, boolean reviewUsed, List<String> concepts,
                      List<String> recommendationsAdopted, boolean mistakePrevented,
                      int estimatedTimeSavedMinutes, String confidence) {
        this.task = task;
        this.reviewUsed = reviewUsed;
        this.concepts = concepts;
        this.recommendationsAdopted = recommendationsAdopted;
        this.mistakePrevented = mistakePrevented;
        this.estimatedTimeSavedMinutes = estimatedTimeSavedMinutes;
        this.confidence = confidence;
    }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    public boolean isReviewUsed() { return reviewUsed; }
    public void setReviewUsed(boolean reviewUsed) { this.reviewUsed = reviewUsed; }
    public List<String> getConcepts() { return concepts; }
    public void setConcepts(List<String> concepts) { this.concepts = concepts; }
    public List<String> getRecommendationsAdopted() { return recommendationsAdopted; }
    public void setRecommendationsAdopted(List<String> recommendationsAdopted) { this.recommendationsAdopted = recommendationsAdopted; }
    public boolean isMistakePrevented() { return mistakePrevented; }
    public void setMistakePrevented(boolean mistakePrevented) { this.mistakePrevented = mistakePrevented; }
    public int getEstimatedTimeSavedMinutes() { return estimatedTimeSavedMinutes; }
    public void setEstimatedTimeSavedMinutes(int estimatedTimeSavedMinutes) { this.estimatedTimeSavedMinutes = estimatedTimeSavedMinutes; }
    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }
}
