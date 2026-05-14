package com.expensetracker.controller;

import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.SignupRequest;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerUser_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setName("John Doe");
        signupRequest.setEmail("john@example.com");
        signupRequest.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void registerUser_EmailExists_ReturnsBadRequest() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setName("John Doe");
        signupRequest.setEmail("john@example.com");
        signupRequest.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }
}
