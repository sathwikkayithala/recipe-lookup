package com.example.recipelookup.recipemodels;

import com.example.recipelookup.usermodels.User;
import com.example.recipelookup.usermodels.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @GetMapping("/search")
    public List<Recipe> searchRecipe(@RequestParam String query) throws Exception {
        return recipeService.searchRecipe(query);
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveRecipe(@RequestBody Recipe recipe) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Recipe existingRecipe = recipeRepository.findById(recipe.getId())
                .orElseGet(() -> {
                    return recipeRepository.save(recipe);
                });

        if (user.getSavedRecipes().contains(existingRecipe)) {
            return ResponseEntity.ok("Recipe was already saved.");
        }

        user.getSavedRecipes().add(existingRecipe);
        userRepository.save(user);

        return ResponseEntity.ok("Recipe saved successfully.");
    }


    @PostMapping("/unsave")
    public ResponseEntity<String> unsaveRecipe(@RequestBody Long recipeId) {
        System.out.println("Recipe ID to unsave: " + recipeId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated.");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found."));

        Recipe recipeToRemove = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found."));

        if (!user.getSavedRecipes().contains(recipeToRemove)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe was not saved.");
        }

        user.getSavedRecipes().remove(recipeToRemove);
        userRepository.save(user);

        return ResponseEntity.ok("Recipe unsaved successfully.");
    }

}

