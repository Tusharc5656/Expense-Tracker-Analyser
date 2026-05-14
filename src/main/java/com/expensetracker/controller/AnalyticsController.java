package com.expensetracker.controller;

import com.expensetracker.dto.AnalyticsDTO;
import com.expensetracker.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/monthly")
    public ResponseEntity<AnalyticsDTO> getMonthlyAnalytics(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        String email = getAuthenticatedUserEmail();
        AnalyticsDTO analytics = analyticsService.getMonthlyAnalytics(month, year, email);
        return ResponseEntity.ok(analytics);
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
