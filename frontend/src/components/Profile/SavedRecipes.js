import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoggedIn = () => localStorage.getItem('token') !== null;


  useEffect(() => {
    const fetchSavedRecipes = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8090/api/profile/saved-recipes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedRecipes(response.data);
        } catch (error) {
            setErrorMessage("Could not fetch saved recipes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    if (isLoggedIn()) {
      setErrorMessage("");
      fetchSavedRecipes();
    } else {
      setErrorMessage("Please login to view saved recipes.");
    }
  }, []);

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
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Saved Recipes</h2>
      {loading && <p className="text-center">Loading...</p>}
      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
      {savedRecipes.length > 0 ? (
          <ul className="list-unstyled row">
              {savedRecipes.map(recipe => (
                  <li key={recipe.id} className="col-md-4 mb-4">
                      <div className="card h-100">
                          <img src={recipe.image} alt={recipe.title} className="card-img-top" />
                          <div className="card-body">
                              <h3 className="card-title">{recipe.title}</h3>
                              {recipe.summary && (
                                  <p
                                    className="card-text"
                                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                                  />
                              )}
                          </div>
                          <div className="card-footer text-center">
                              {savedRecipeIds.includes(recipe.id) ? (
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleUnsaveRecipe(recipe.id)}
                                  >
                                    Unsave
                                  </button>
                              ) : (
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleSaveRecipe(recipe)}
                                  >
                                    Save
                                  </button>
                              )}
                          </div>
                      </div>
                  </li>
              ))}
          </ul>
      ) : (
        <p className="text-center">No saved recipes found.</p>
      )}
    </div>
  );
};

export default SavedRecipes;
