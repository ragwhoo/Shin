package com.experienceengine.config;

import com.experienceengine.loader.YamlGraphLoader;
import com.experienceengine.model.Graph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfig {
    @Bean
    public Graph graph(YamlGraphLoader loader) {
        return loader.loadGraph();
    }
}
