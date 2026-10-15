package com.example.onlinelearningportal.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/courses should allow public unauthenticated access")
    void testPublicCoursesList() throws Exception {
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").value(0));
    }

    @Test
    @DisplayName("GET /api/courses/categories should allow public access")
    void testPublicCategories() throws Exception {
        mockMvc.perform(get("/api/courses/categories"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/admin/courses should block unauthenticated users with 401")
    void testAdminCoursesUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/admin/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
    @DisplayName("POST /api/admin/courses should block STUDENT role users with 403 Forbidden")
    void testAdminCoursesForbiddenForStudents() throws Exception {
        mockMvc.perform(post("/api/admin/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Hacked Course\"}"))
                .andExpect(status().isForbidden());
    }
}
