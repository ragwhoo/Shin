package com.experienceengine.dto.analytics;

import java.util.List;
import java.util.Map;

public class ExplorerResponse {
    private List<Map<String, Object>> topConcepts;
    private List<Map<String, Object>> topExperiences;
    private List<Map<String, Object>> mostUsedMemories;
    private List<Map<String, Object>> recentlyLearned;

    public ExplorerResponse() {}

    public ExplorerResponse(List<Map<String, Object>> topConcepts, List<Map<String, Object>> topExperiences,
                            List<Map<String, Object>> mostUsedMemories, List<Map<String, Object>> recentlyLearned) {
        this.topConcepts = topConcepts;
        this.topExperiences = topExperiences;
        this.mostUsedMemories = mostUsedMemories;
        this.recentlyLearned = recentlyLearned;
    }

    public List<Map<String, Object>> getTopConcepts() { return topConcepts; }
    public void setTopConcepts(List<Map<String, Object>> topConcepts) { this.topConcepts = topConcepts; }
    public List<Map<String, Object>> getTopExperiences() { return topExperiences; }
    public void setTopExperiences(List<Map<String, Object>> topExperiences) { this.topExperiences = topExperiences; }
    public List<Map<String, Object>> getMostUsedMemories() { return mostUsedMemories; }
    public void setMostUsedMemories(List<Map<String, Object>> mostUsedMemories) { this.mostUsedMemories = mostUsedMemories; }
    public List<Map<String, Object>> getRecentlyLearned() { return recentlyLearned; }
    public void setRecentlyLearned(List<Map<String, Object>> recentlyLearned) { this.recentlyLearned = recentlyLearned; }
}
