package com.expensetracker.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class AnalyticsDTO {
    private BigDecimal totalSpent;
    private String highestSpendingCategory;
    private BigDecimal highestSpendingAmount;
    private Map<String, BigDecimal> categoryBreakdown;
    private Integer month;
    private Integer year;
}
