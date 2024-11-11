package com.example.recipelookup.usermodels;

import com.example.recipelookup.recipemodels.Recipe;
import com.example.recipelookup.recipemodels.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    @GetMapping("/saved-recipes")
    public List<Recipe> getUserSavedRecipes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated.");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User was not found."));

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User was not found.");
        }
        return recipeRepository.findAllUserSavedRecipes(user.getId());
    }
}
