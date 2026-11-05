package com.skillswap.skillswap_backend.controller;

import com.skillswap.skillswap_backend.entity.Student;
import com.skillswap.skillswap_backend.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentProfileController {

    private final StudentRepository studentRepository;

    public StudentProfileController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // View student profile
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {

        Optional<Student> studentOptional =
                studentRepository.findById(id);

        if (studentOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found!"));
        }

        Student student = studentOptional.get();

        return ResponseEntity.ok(Map.of(
                "id", student.getId(),
                "name", student.getName(),
                "email", student.getEmail(),
                "department", student.getDepartment() == null ? "" : student.getDepartment(),
                "college", student.getCollege() == null ? "" : student.getCollege(),
                "skillsToTeach", student.getSkillsToTeach() == null ? "" : student.getSkillsToTeach(),
                "skillsToLearn", student.getSkillsToLearn() == null ? "" : student.getSkillsToLearn()
        ));
    }

    // Update student profile
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateStudentProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> profileData) {

        Optional<Student> studentOptional =
                studentRepository.findById(id);

        if (studentOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found!"));
        }

        Student student = studentOptional.get();

        student.setDepartment(profileData.get("department"));
        student.setCollege(profileData.get("college"));
        student.setSkillsToTeach(profileData.get("skillsToTeach"));
        student.setSkillsToLearn(profileData.get("skillsToLearn"));

        studentRepository.save(student);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully!"
        ));
    }

}
