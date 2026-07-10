package com.experienceengine;

import com.experienceengine.controller.ReviewController;
import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import com.experienceengine.service.ReflectionEngine;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
class ReviewControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ReflectionEngine reflectionEngine;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void shouldReturnJudgment() throws Exception {
        when(reflectionEngine.review(any())).thenReturn(
                new ReviewResponse("test", List.of("Auth"), List.of("lesson"),
                        List.of("warning"), List.of("rec"), "high", List.of("e1"))
        );
        mockMvc.perform(post("/api/v1/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReviewRequest("test"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.concepts[0]").value("Auth"))
                .andExpect(jsonPath("$.confidence").value("high"));
    }

    @Test
    void shouldRejectEmptyTask() throws Exception {
        mockMvc.perform(post("/api/v1/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReviewRequest(""))))
                .andExpect(status().isBadRequest());
    }
}
