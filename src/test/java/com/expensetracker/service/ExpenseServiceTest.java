package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDTO;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;
    private Expense testExpense;
    private ExpenseDTO testExpenseDTO;
    private String testEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email(testEmail)
                .password("password")
                .build();

        testExpense = Expense.builder()
                .id(1L)
                .title("Lunch")
                .amount(new BigDecimal("15.50"))
                .category("Food")
                .date(LocalDate.now())
                .user(testUser)
                .build();

        testExpenseDTO = new ExpenseDTO();
        testExpenseDTO.setTitle("Lunch");
        testExpenseDTO.setAmount(new BigDecimal("15.50"));
        testExpenseDTO.setCategory("Food");
        testExpenseDTO.setDate(LocalDate.now());
    }

    @Test
    void createExpense_Success() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseDTO result = expenseService.createExpense(testExpenseDTO, testEmail);

        assertNotNull(result);
        assertEquals(testExpenseDTO.getTitle(), result.getTitle());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void createExpense_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            expenseService.createExpense(testExpenseDTO, testEmail);
        });
    }

    @Test
    void getExpenseById_Success() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testExpense));

        ExpenseDTO result = expenseService.getExpenseById(1L, testEmail);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void deleteExpense_Success() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testExpense));

        expenseService.deleteExpense(1L, testEmail);

        verify(expenseRepository, times(1)).delete(testExpense);
    }
}
