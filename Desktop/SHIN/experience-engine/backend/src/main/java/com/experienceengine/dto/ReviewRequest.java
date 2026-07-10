package com.experienceengine.dto;

public class ReviewRequest {
    private String task;
    public ReviewRequest() {}
    public ReviewRequest(String task) { this.task = task; }
    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
}
