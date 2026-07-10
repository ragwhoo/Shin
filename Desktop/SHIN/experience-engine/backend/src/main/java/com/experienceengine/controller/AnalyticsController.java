package com.experienceengine.controller;

import com.experienceengine.dto.analytics.ExplorerResponse;
import com.experienceengine.dto.analytics.HealthResponse;
import com.experienceengine.dto.analytics.OverviewResponse;
import com.experienceengine.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<OverviewResponse> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/explorer")
    public ResponseEntity<ExplorerResponse> getExplorer() {
        return ResponseEntity.ok(analyticsService.getExplorer());
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> getHealth() {
        return ResponseEntity.ok(analyticsService.getHealth());
    }
}
