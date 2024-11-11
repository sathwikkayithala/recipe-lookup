package com.example.recipelookup.recipemodels;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    @Value("${spoonacular.api.key}")
    private String spoonacularApiKey;
    @Value("${spoonacular.api.base-url}")
    private String baseUrl;
    private final RecipeRepository recipeRepository;

    public List<Recipe> searchRecipe(String query) throws Exception {
        String url = baseUrl + "complexSearch?query=" + query + "&apiKey=" + spoonacularApiKey;
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<RecipeGet> responseEntity = restTemplate.getForEntity(url, RecipeGet.class);

        if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
            List<Recipe> recipes = responseEntity.getBody().getResults();

            if (!recipes.isEmpty()) {
                for (Recipe recipe : recipes) {
                    String summaryRequest = baseUrl + recipe.getId() + "/summary?apiKey=" + spoonacularApiKey;

                    ResponseEntity<RecipeSummaryResponse> summaryResponse = restTemplate.getForEntity(summaryRequest, RecipeSummaryResponse.class);

                    if (summaryResponse.getStatusCode().is2xxSuccessful() && summaryResponse.getBody() != null) {
                        recipe.setSummary(summaryResponse.getBody().getSummary());
                    } else {
                        System.err.println("Failed to fetch the summary for recipe: " + recipe.getTitle());
                    }
                }
            }
            return recipes.isEmpty() ? Collections.emptyList() : recipes;
        } else {
            System.err.println("Failed to fetch recipes: " + responseEntity.getStatusCode() + ", Body: " + responseEntity.getBody());
            throw new Exception("Failed to fetch requested recipes.");
        }
    }

}
