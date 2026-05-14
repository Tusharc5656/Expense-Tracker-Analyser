package com.expensetracker.service;

import com.expensetracker.dto.BudgetDTO;
import com.expensetracker.dto.BudgetResponseDTO;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public BudgetResponseDTO setBudget(BudgetDTO budgetDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if budget already exists for this category and month/year
        Optional<Budget> existingBudget = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), budgetDTO.getCategory(), budgetDTO.getMonth(), budgetDTO.getYear());

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setMonthlyLimit(budgetDTO.getMonthlyLimit());
        } else {
            budget = Budget.builder()
                    .category(budgetDTO.getCategory())
                    .monthlyLimit(budgetDTO.getMonthlyLimit())
                    .month(budgetDTO.getMonth())
                    .year(budgetDTO.getYear())
                    .user(user)
                    .build();
        }

        Budget savedBudget = budgetRepository.save(budget);
        return getBudgetStatus(savedBudget);
    }

    public List<BudgetResponseDTO> getBudgetsForMonth(Integer month, Integer year, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year);
        
        return budgets.stream()
                .map(this::getBudgetStatus)
                .collect(Collectors.toList());
    }

    private BudgetResponseDTO getBudgetStatus(Budget budget) {
        YearMonth yearMonth = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        Double totalSpentDouble = expenseRepository.getTotalAmountByUserIdAndDateBetween(
                budget.getUser().getId(), startDate, endDate);
        
        BigDecimal totalSpent = totalSpentDouble != null ? BigDecimal.valueOf(totalSpentDouble) : BigDecimal.ZERO;
        BigDecimal remaining = budget.getMonthlyLimit().subtract(totalSpent);
        boolean isExceeded = remaining.compareTo(BigDecimal.ZERO) < 0;

        BudgetResponseDTO dto = new BudgetResponseDTO();
        dto.setId(budget.getId());
        dto.setCategory(budget.getCategory());
        dto.setMonthlyLimit(budget.getMonthlyLimit());
        dto.setMonth(budget.getMonth());
        dto.setYear(budget.getYear());
        dto.setTotalSpent(totalSpent);
        dto.setRemainingBudget(remaining);
        dto.setExceeded(isExceeded);
        
        return dto;
    }
}
