package com.experienceengine.dto;

public class LearnRequest {
    private String type;
    private String title;
    private String content;
    private java.util.List<String> tags;

    public LearnRequest() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public java.util.List<String> getTags() { return tags; }
    public void setTags(java.util.List<String> tags) { this.tags = tags; }
}
