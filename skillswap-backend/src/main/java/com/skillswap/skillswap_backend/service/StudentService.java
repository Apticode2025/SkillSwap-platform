package com.skillswap.skillswap_backend.service;

import com.skillswap.skillswap_backend.entity.Student;
import com.skillswap.skillswap_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Student Login
    public Optional<Student> login(String email, String password) {

        Optional<Student> studentOptional =
                studentRepository.findByEmail(email);

        if (studentOptional.isPresent()) {

            Student student = studentOptional.get();

            if (student.getPassword().equals(password)) {
                return Optional.of(student);
            }
        }

        return Optional.empty();
    }

}
