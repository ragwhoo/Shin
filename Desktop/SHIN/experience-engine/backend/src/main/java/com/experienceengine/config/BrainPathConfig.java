package com.experienceengine.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "experience-engine")
public class BrainPathConfig {
    private String brainPath = "../engineering-brain";
    public String getBrainPath() { return brainPath; }
    public void setBrainPath(String brainPath) { this.brainPath = brainPath; }
}
