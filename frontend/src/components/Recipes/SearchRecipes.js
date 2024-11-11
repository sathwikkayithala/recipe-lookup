import React, { useState } from 'react';
import axios from 'axios';

const SearchRecipes = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [savedRecipeIds, setSavedRecipeIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    };

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        setErrorMessage("");
        try {
            const response = await axios.get('http://localhost:8090/api/recipes/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                params: { query }
            });
            setRecipes(response.data);
        } catch (error) {
          setErrorMessage("Error fetching recipes: ", error);
        }
    };

    const handleSaveRecipe = async (recipe) => {
        if (!isLoggedIn()) {
          alert("Please log in to save recipes.");
          return;
        }
        const token = localStorage.getItem('token');
        try {
          await axios.post('http://localhost:8090/api/recipes/save', recipe, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          setSavedRecipeIds([...savedRecipeIds, recipe.id]);
        } catch (error) {
          console.error("Error saving recipe: ", error);
          alert("Error saving recipe. Please try again.");
        }
    };

    const handleUnsaveRecipe = async (recipeId) => {
        if (!isLoggedIn()) {
          alert("Please log in to unsave recipes.");
          return;
        }
        const token = localStorage.getItem('token');
        try {
          await axios.post('http://localhost:8090/api/recipes/unsave', recipeId, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          setSavedRecipeIds(savedRecipeIds.filter(id => id !== recipeId));
        } catch (error) {
          console.error("Error unsaving recipe: ", error);
          alert("Error unsaving recipe. Please try again.");
        }
    };

    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <input
              type="text"
              placeholder="Search for a recipe..."
              className="form-control me-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ maxWidth: "300px" }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
              Search
          </button>
        </div>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <div className="row">
          {recipes.map((recipe) => (
              <div key={recipe.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                      <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                      <div className="card-body">
                          <h5 className="card-title">{recipe.title}</h5>
                          {recipe.summary && (
                              <p
                                  className="card-text"
                                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                              />
                          )}
                      </div>
                      <div className="card-footer">
                          {savedRecipeIds.includes(recipe.id) ? (
                              <button
                                  className="btn btn-outline-danger w-100"
                                  onClick={() => handleUnsaveRecipe(recipe.id)}
                              >
                                  Unsave
                              </button>
                          ) : (
                              <button
                                  className="btn btn-outline-primary w-100"
                                  onClick={() => handleSaveRecipe(recipe)}
                              >
                                  Save
                              </button>
                          )}
                      </div>
                  </div>
              </div>
          ))}
        </div>
      </div>  
    );
};

export default SearchRecipes;
