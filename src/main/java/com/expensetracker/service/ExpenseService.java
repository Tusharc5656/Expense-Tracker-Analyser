package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDTO;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = Expense.builder()
                .title(expenseDTO.getTitle())
                .amount(expenseDTO.getAmount())
                .category(expenseDTO.getCategory())
                .date(expenseDTO.getDate())
                .paymentMethod(expenseDTO.getPaymentMethod())
                .notes(expenseDTO.getNotes())
                .user(user)
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToDTO(savedExpense);
    }

    public Page<ExpenseDTO> getAllExpenses(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByUserId(user.getId(), pageable).map(this::mapToDTO);
    }

    public ExpenseDTO getExpenseById(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        return mapToDTO(expense);
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expense.setTitle(expenseDTO.getTitle());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDate(expenseDTO.getDate());
        expense.setPaymentMethod(expenseDTO.getPaymentMethod());
        expense.setNotes(expenseDTO.getNotes());

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToDTO(updatedExpense);
    }

    public void deleteExpense(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expenseRepository.delete(expense);
    }

    private ExpenseDTO mapToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setDate(expense.getDate());
        dto.setPaymentMethod(expense.getPaymentMethod());
        dto.setNotes(expense.getNotes());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        return dto;
    }
}
