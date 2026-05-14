package com.expensetracker.service;

import com.expensetracker.dto.AnalyticsDTO;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public AnalyticsDTO getMonthlyAnalytics(Integer month, Integer year, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);

        BigDecimal totalSpent = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        String highestCategory = null;
        BigDecimal highestAmount = BigDecimal.ZERO;

        for (Map.Entry<String, BigDecimal> entry : categoryBreakdown.entrySet()) {
            if (entry.getValue().compareTo(highestAmount) > 0) {
                highestAmount = entry.getValue();
                highestCategory = entry.getKey();
            }
        }

        return AnalyticsDTO.builder()
                .totalSpent(totalSpent)
                .highestSpendingCategory(highestCategory)
                .highestSpendingAmount(highestAmount)
                .categoryBreakdown(categoryBreakdown)
                .month(month)
                .year(year)
                .build();
    }
}
