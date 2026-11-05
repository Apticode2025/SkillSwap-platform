package com.skillswap.skillswap_backend.controller;

import com.skillswap.skillswap_backend.entity.Student;
import com.skillswap.skillswap_backend.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentDirectoryController {

    private final StudentRepository studentRepository;

    public StudentDirectoryController(
            StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all registered students without exposing passwords
    @GetMapping("/directory")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {

        List<Map<String, Object>> students =
                studentRepository.findAll()
                        .stream()
                        .map(student -> {

                            Map<String, Object> studentData =
                                    new java.util.HashMap<>();

                            studentData.put("id", student.getId());
                            studentData.put("name", student.getName());
                            studentData.put("email", student.getEmail());

                            studentData.put(
                                    "department",
                                    student.getDepartment() == null
                                            ? ""
                                            : student.getDepartment()
                            );

                            studentData.put(
                                    "college",
                                    student.getCollege() == null
                                            ? ""
                                            : student.getCollege()
                            );

                            studentData.put(
                                    "skillsToTeach",
                                    student.getSkillsToTeach() == null
                                            ? ""
                                            : student.getSkillsToTeach()
                            );

                            studentData.put(
                                    "skillsToLearn",
                                    student.getSkillsToLearn() == null
                                            ? ""
                                            : student.getSkillsToLearn()
                            );

                            return studentData;
                        })
                        .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }
}