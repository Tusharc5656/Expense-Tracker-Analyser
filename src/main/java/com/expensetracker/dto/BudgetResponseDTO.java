package com.expensetracker.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class BudgetResponseDTO extends BudgetDTO {
    private BigDecimal totalSpent;
    private BigDecimal remainingBudget;
    private boolean isExceeded;
}
