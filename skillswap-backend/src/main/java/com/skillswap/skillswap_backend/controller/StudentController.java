package com.skillswap.skillswap_backend.controller;

import com.skillswap.skillswap_backend.entity.Student;
import com.skillswap.skillswap_backend.repository.StudentRepository;
import com.skillswap.skillswap_backend.service.StudentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentRepository studentRepository;
    private final StudentService studentService;

    public StudentController(
            StudentRepository studentRepository,
            StudentService studentService) {

        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

    // Student Registration API
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerStudent(
            @RequestBody Student student) {

        Map<String, String> response = new HashMap<>();

        if (studentRepository.existsByEmail(student.getEmail())) {
            response.put("message", "Email is already registered!");

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        studentRepository.save(student);

        response.put("message", "Student registered successfully!");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Student Login API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginStudent(
            @RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null
                || email.isBlank() || password.isBlank()) {

            response.put("message", "Email and password are required!");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        Optional<Student> studentOptional =
                studentService.login(email, password);

        if (studentOptional.isPresent()) {

            Student student = studentOptional.get();

            response.put("message", "Login successful!");
            response.put("id", student.getId());
            response.put("name", student.getName());
            response.put("email", student.getEmail());
            response.put("department", student.getDepartment());
            response.put("college", student.getCollege());

            return ResponseEntity.ok(response);
        }

        response.put("message", "Invalid email or password!");

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

// Get All Students API
    @GetMapping("/all")
    public ResponseEntity<?> getAllStudents() {

        return ResponseEntity.ok(
                studentRepository.findAll()
                        .stream()
                        .map(student -> {
                            Map<String, Object> studentData = new HashMap<>();

                            studentData.put("id", student.getId());
                            studentData.put("name", student.getName());
                            studentData.put("email", student.getEmail());
                            studentData.put("department", student.getDepartment());
                            studentData.put("college", student.getCollege());

                            // Include both skill fields
                            studentData.put("skillsToTeach", student.getSkillsToTeach());
                            studentData.put("skillsToLearn", student.getSkillsToLearn());

                            return studentData;
                        })
                        .toList()
        );
    }

}
