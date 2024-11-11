package com.example.recipelookup.recipemodels;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Optional<Recipe> findByTitle(String title);
    Optional<Recipe> findById(Long id);
    @Query(value = "SELECT r.* FROM recipe r JOIN user_saved_recipes us ON us.recipe_id = r.id WHERE us.user_id = :userId", nativeQuery = true)
    List<Recipe> findAllUserSavedRecipes(@Param("userId") Long userId);
}
