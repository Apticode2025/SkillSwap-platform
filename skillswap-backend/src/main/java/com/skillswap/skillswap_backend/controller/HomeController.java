package com.skillswap.skillswap_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to SkillSwap Platform!";
    }

    @GetMapping("/api/status")
    public String status() {
        return "SkillSwap Backend is Running Successfully!";
    }
}