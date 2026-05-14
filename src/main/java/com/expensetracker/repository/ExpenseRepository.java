package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Find an expense by ID and User ID (to ensure users only access their own expenses)
    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    // Get all expenses for a user with pagination
    Page<Expense> findByUserId(Long userId, Pageable pageable);

    // Filter expenses by category
    Page<Expense> findByUserIdAndCategory(Long userId, String category, Pageable pageable);

    // Filter expenses by date range
    Page<Expense> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Get total expenses for a user within a date range (used for analytics/budget)
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.date >= :startDate AND e.date <= :endDate")
    Double getTotalAmountByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Get all expenses for analytics
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
