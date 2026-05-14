package com.expensetracker.controller;

import com.expensetracker.dto.BudgetDTO;
import com.expensetracker.dto.BudgetResponseDTO;
import com.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponseDTO> setBudget(@Valid @RequestBody BudgetDTO budgetDTO) {
        String email = getAuthenticatedUserEmail();
        BudgetResponseDTO response = budgetService.setBudget(budgetDTO, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getBudgets(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        String email = getAuthenticatedUserEmail();
        List<BudgetResponseDTO> budgets = budgetService.getBudgetsForMonth(month, year, email);
        return ResponseEntity.ok(budgets);
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
