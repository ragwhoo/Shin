package com.experienceengine.dto.analytics;

public class OverviewResponse {
    private long tasksReviewed;
    private long recommendationsAdopted;
    private long mistakesPrevented;
    private double estimatedHoursSaved;
    private long totalMemories;
    private double reviewSuccessRate;

    public OverviewResponse() {}

    public long getTasksReviewed() { return tasksReviewed; }
    public void setTasksReviewed(long tasksReviewed) { this.tasksReviewed = tasksReviewed; }
    public long getRecommendationsAdopted() { return recommendationsAdopted; }
    public void setRecommendationsAdopted(long recommendationsAdopted) { this.recommendationsAdopted = recommendationsAdopted; }
    public long getMistakesPrevented() { return mistakesPrevented; }
    public void setMistakesPrevented(long mistakesPrevented) { this.mistakesPrevented = mistakesPrevented; }
    public double getEstimatedHoursSaved() { return estimatedHoursSaved; }
    public void setEstimatedHoursSaved(double estimatedHoursSaved) { this.estimatedHoursSaved = estimatedHoursSaved; }
    public long getTotalMemories() { return totalMemories; }
    public void setTotalMemories(long totalMemories) { this.totalMemories = totalMemories; }
    public double getReviewSuccessRate() { return reviewSuccessRate; }
    public void setReviewSuccessRate(double reviewSuccessRate) { this.reviewSuccessRate = reviewSuccessRate; }
}
